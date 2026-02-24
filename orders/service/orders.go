package service
import(
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	"context"
	"fmt"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
)

type OrdersService struct{
	stockClient pbStock.StockServiceClient
}

func NewOrdersService(stockClient pbStock.StockServiceClient) *OrdersService{
	return &OrdersService{stockClient: stockClient}
}

func (o *OrdersService) CreateOrder(ctx context.Context, customerID string, items []*pbStock.StockItem) (*pb.CreateOrderResponse, error){
	
	resp, err := o.stockClient.CheckAvailability(ctx, &pbStock.CheckAvailabilityRequest{Items: items})
	if err != nil{
		return nil, fmt.Errorf("could not check stock : %w", err)
	}

	if !resp.Available{
		return nil, fmt.Errorf("stock unavailable for items: %v", resp.UnavailableIds)
	}
	
	return &pb.CreateOrderResponse{
   		OrderId:     "test-order-123",
    		TotalPrice:  9.99,
    		PaymentLink: "https://stripe.com/test",
	}, nil	
}
