package handler

import(
	"log"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
	"net/http"
	"encoding/json"
	"context"
	"time"
	"github.com/stripe/stripe-go/v79"
	"github.com/rgarcia2304/recipe-marketplace/commons/broker"
	"io"
	"os"
	"fmt"
	"github.com/stripe/stripe-go/v79/webhook"
	"github.com/rgarcia2304/recipe-marketplace/commons/events"
	"github.com/rgarcia2304/recipe-marketplace/orders/repository"

)

type GatewayHandler struct{
	ordersClient pb.OrdersServiceClient
	broker *broker.Broker
}

func NewGatewayHandler(ordersClient pb.OrdersServiceClient, b *broker.Broker) *GatewayHandler{
	return &GatewayHandler{ordersClient: ordersClient, broker: b}
}

func (h *GatewayHandler) CreateOrder (w http.ResponseWriter, r *http.Request){
	type orderItem struct{
		ListingId string `json:"listing_id"`
		Quantity int32		`json:"quantity"`
		Price float32		`json:"price"`
    	}
    type CreateOrderParams struct{
	    CustomerId string	`json:"customer_id"`
	    Items []orderItem	`json:"items"`
    }
    decoder := json.NewDecoder(r.Body)
    p := CreateOrderParams{}
    err := decoder.Decode(&p)
    if err != nil{
        log.Printf("Error marshalling data %s", err)
        w.WriteHeader(500)
        return
    }
    pbItems := make([]*pb.OrderItem, len(p.Items))
    for i, item := range p.Items{
        pbItems[i] = &pb.OrderItem{
            ListingId: item.ListingId,
            Quantity: item.Quantity,
            Price: item.Price,
        }
    }
    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    defer cancel()
    resp, err := h.ordersClient.CreateOrder(ctx, &pb.CreateOrderRequest{
        CustomerId: p.CustomerId,
        Items: pbItems,
    })
    if err != nil{
        log.Printf("could not order: %v", err)
        return
    }

    data, err := json.Marshal(resp)
    if err != nil{
        log.Printf("Error marshalling JSON")
        w.WriteHeader(500)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    w.Write(data)
    w.Write([]byte("\n"))
}

func(h *GatewayHandler) StripeWebhook(w http.ResponseWriter, req *http.Request){
	const MaxBodyBytes = int64(65536)
	req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
	payload, err := io.ReadAll(req.Body)
	if err != nil{
		fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}


	
	//then pass this off into somewhere
	webhookSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	event, err := webhook.ConstructEventWithOptions(payload, req.Header.Get("Stripe-Signature"), webhookSecret,webhook.ConstructEventOptions{IgnoreAPIVersionMismatch: true,},)
	if err != nil {
        	fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
        	w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature
        	return
    	}

	
	switch event.Type{
		case "checkout.session.completed":
			var session stripe.CheckoutSession
			err := json.Unmarshal(event.Data.Raw, &session)
			if err != nil{
				fmt.Fprintf(os.Stderr, "Error parshing webhook JSON: %v\n", err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			orderID := session.Metadata["order_id"]
			//call the orders service to get the orders details 
			ctx, cancel := context.WithTimeout(context.Background(), time.Second*6)
			defer cancel()

			order, err := h.ordersClient.GetOrder(ctx, &pb.GetOrderRequest{OrderId: orderID})
			if err != nil{
				fmt.Fprintf(os.Stderr, "Error getting order: %v\n", err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			if order.Status != "pending"{
				w.WriteHeader(http.StatusOK)
				return
			}

			err = h.broker.Publish("order.paid", events.OrderPaidEvent{
				OrderID: order.OrderId,
				CustomerID: order.CustomerId,
				TotalCents: int32(order.TotalPrice),
				PaymentIntentID: session.PaymentIntent.ID,
			})
			if err != nil{
				fmt.Fprintf(os.Stderr,"Error publishing message to RabbitMQ %v", err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			_, err = h.ordersClient.UpdateOrderStatus(ctx, &pb.UpdateOrderStatusRequest{OrderId: orderID, Status: string(repository.StatusPaid)}) 

			if err != nil{
				fmt.Fprintf(os.Stderr,"Error updating status %v", err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			//publish this message to rabbit
			fmt.Println("payment session was sucessfully completed")
			
		default:
			fmt.Fprintf(os.Stderr, "Unhandled event type: %s \n", event.Type)
	}

	w.WriteHeader(http.StatusOK)
}

	
