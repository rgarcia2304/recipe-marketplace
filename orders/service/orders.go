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
	}, nil	
}
