package main

import(
	"context"
    	"log"
    	"net"

    	"google.golang.org/grpc"

    	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
)

const(
	port = ":9001"
)

type server struct{
	pb.UnimplementedOrdersServiceServer
}

func (s *server) CreateOrder(ctx context.Context, in *pb.CreateOrderRequest) (*pb.CreateOrderResponse, error){
	log.Printf("Received: %v's order", in.GetCustomerId())
	// need to grab fields from the datbase
	return &pb.CreateOrderResponse{}, nil
}

func main(){
	lis, err := net.Listen("tcp", port)
	if err != nil{
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterOrdersServiceServer(s, &server{})
	if err := s.Serve(lis); err != nil{
		log.Fatalf("failed to serve: %v", err)
	}
}
