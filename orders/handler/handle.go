package handler 

import(
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
	"github.com/rgarcia2304/recipe-marketplace/orders/service"
	"context"
)

type OrdersHandler struct{
	service *service.OrdersService
	pb.UnimplementedOrdersServiceServer
}

func NewOrdersHandler(svc *service.OrdersService) *OrdersHandler{
	return &OrdersHandler{service: svc}
}

func (s *OrdersHandler) CreateOrder(ctx context.Context, in *pb.CreateOrderRequest)(*pb.CreateOrderResponse,error){
	//convert stock items into stock items
	stockItems := make([]*pbStock.StockItem, len(in.Items))

	for i, item := range in.Items{
		stockItems[i] = &pbStock.StockItem{
			ListingId: item.ListingId,
			Quantity: item.Quantity,
		}	
	}
	return s.service.CreateOrder(ctx, in.CustomerId, stockItems) 
}
