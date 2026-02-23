package handler

import(
	"log"
	"context"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
)

type GatewayHandler struct{
	ordersClient pb.OrdersServiceClient
}

func NewGatewayHandler(ordersClient pb.OrdersServiceClient) *GatewayHandler{
	return &GatewayHandler{ordersClient: ordersClient}
}

func (h *GatewayHandler) CreateOrder(ctx context.Context, in *pb.CreateOrderRequest) (*pb.CreateOrderResponse, error){
	log.Printf("Received: %v's order", in.CustomerId)
	// need to grab fields from the datbase
	return &pb.CreateOrderResponse{
        OrderId:    "test-order-123",
        TotalPrice: 9.99,
        PaymentLink: "https://stripe.com/test",
    	}, nil
}
