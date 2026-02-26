package handler

import(
	"log"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
	"net/http"
	"encoding/json"
	"context"
	"time"
)

type GatewayHandler struct{
	ordersClient pb.OrdersServiceClient
}

func NewGatewayHandler(ordersClient pb.OrdersServiceClient) *GatewayHandler{
	return &GatewayHandler{ordersClient: ordersClient}
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
