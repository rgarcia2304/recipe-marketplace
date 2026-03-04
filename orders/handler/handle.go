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

func (s *OrdersHandler) GetOrder(ctx context.Context, in *pb.GetOrderRequest)(*pb.Order, error){
	 return s.service.GetOrder(ctx, in.OrderId)

}
