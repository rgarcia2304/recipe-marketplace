package service
import(
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	"context"
	"fmt"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
	"github.com/rgarcia2304/recipe-marketplace/orders/repository"
	//"log"
	"github.com/rgarcia2304/recipe-marketplace/commons/broker"
	"github.com/rgarcia2304/recipe-marketplace/commons/events"
	"github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/checkout/session"
)

type OrdersService struct{
	stockClient pbStock.StockServiceClient
	repo *repository.OrdersRepository
	broker *broker.Broker
}

func NewOrdersService(stockClient pbStock.StockServiceClient,
	repo *repository.OrdersRepository,
	broker *broker.Broker,
	) *OrdersService{
		return &OrdersService{stockClient: stockClient, repo: repo, broker: broker}
}

func (o *OrdersService) GetOrder(ctx context.Context, orderID string)(*pb.Order, error){
	order, err := o.repo.GetOrder(ctx, orderID)

	if err != nil{
		return nil, fmt.Errorf("Could not find this item: %v", err)
	}
	var status string
	if order.Status.Valid {
    		status = string(order.Status.OrderStatus)
	}

	return &pb.Order{
    		OrderId:    order.ID.String(),
    		CustomerId: order.CustomerID,
    		TotalPrice: float32(order.TotalPriceCents) / 100,
    		Status:     status,
    		CreatedAt:  order.CreatedAt.Time.String(),
		}, nil

}
func (o *OrdersService) CreateOrder(ctx context.Context, customerID string, items []*pb.OrderItem) (*pb.CreateOrderResponse, error){
	
	stockItems := make([]*pbStock.StockItem, len(items))
	for i, item := range items{
		stockItems[i] = &pbStock.StockItem{
			ListingId: item.ListingId,
			Quantity: item.Quantity,
		}
	}

	resp, err := o.stockClient.CheckAvailability(ctx, &pbStock.CheckAvailabilityRequest{Items: stockItems})
	if err != nil{
		return nil, fmt.Errorf("could not check stock : %w", err)
	}

	if !resp.Available{
		return nil, fmt.Errorf("stock unavailable for items: %v", resp.UnavailableIds)
	}
	
	var totalCents int32
	for _, item := range items{
		totalCents += int32(item.Price * 100) * item.Quantity
	}

	repoItems := make([]repository.OrderItemInput, len(items))
	for i, item := range items{
		repoItems[i] = repository.OrderItemInput{
			ListingID: item.ListingId,
			Quantity: item.Quantity,
			PriceCents: int32(item.Price * 100),
		}
	}

	input := repository.CreateOrderInput{
		CustomerID: customerID,
		TotalPriceCents: totalCents,
		Items: repoItems,
	}

	order, err := o.repo.CreateOrder(ctx, input)
	if err != nil{
		return nil, fmt.Errorf("failed to create order: %w", err)
	}


	//need to process our order to be in the form of stripe line items params 
	lnItems := make([]*stripe.CheckoutSessionLineItemParams, len(items))
	for i, item := range repoItems{
		lnItems[i] = &stripe.CheckoutSessionLineItemParams{
   	 		PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
        		Currency:   stripe.String("usd"),
        		UnitAmount: stripe.Int64(int64(item.PriceCents)),
        		ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
            		Name: stripe.String(item.ListingID),
        		},
    		},
    		Quantity: stripe.Int64(int64(item.Quantity)),
		}	
	}

	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String("http://localhost:8080/orders/success"),
		CancelURL: stripe.String("http://localhost:8080/orders/cancel"),
		LineItems: lnItems,
		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		Metadata: map[string]string{
			"order_id": order.ID.String(),
		},

	}
	
	s, err := session.New(params)
	if err != nil{
		return nil, fmt.Errorf("Could not create stripe checkout session %w", err)
	}
	eventItems := make([]events.OrderEventItem, len(items))
	for i, item := range items{
		eventItems[i] = events.OrderEventItem{
			ListingID: item.ListingId,
			Quantity: item.Quantity,
			PriceCents: int32(item.Price * 100),
		}
	}

	err = o.broker.Publish("order.created", events.OrderCreatedEvent{
		OrderID: order.ID.String(),
		CustomerID: customerID,
		TotalCents: input.TotalPriceCents,
		Items: eventItems,
	})
	if err != nil{
		return nil, fmt.Errorf("failed to publish order.created event: %w", err)
	}
	//log.Println(order)
	return &pb.CreateOrderResponse{
   		OrderId:     order.ID.String(),
    		TotalPrice:  float32(order.TotalPriceCents) / 100,
		PaymentLink: s.URL,
	}, nil	
}
