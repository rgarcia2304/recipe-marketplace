package handler 

import(
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

func (s *OrdersHandler) CreateOrder(ctx context.Context, in *pb.CreateOrderRequest)(*pb.CreateOrderResponse, error){
	 return s.service.CreateOrder(ctx, in.CustomerId, in.Items)

}
