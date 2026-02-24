package main

import(
	"context"
    	"log"
    	"net"

    	"google.golang.org/grpc"

    	pb "github.com/rgarcia2304/recipe-marketplace/proto/stock"
)

const(
	port = ":9003"
)

type server struct{
	pb.UnimplementedStockServiceServer
}

func (s *server) CheckAvailability(ctx context.Context, in *pb.CheckAvailabilityRequest) (*pb.CheckAvailabilityResponse, error){
	log.Printf("Received stock request")
	return &pb.CheckAvailabilityResponse{
		Available: true,
	}, nil
}

func (s *server) ReserveStock(ctx context.Context, in *pb.ReserveStockRequest) (*pb.ReserveStockResponse, error){
	log.Printf("Received Reserve Request")
	return &pb.ReserveStockResponse{
		Success: true,
	}, nil
}

func (s *server) ReleaseStock(ctx context.Context, in *pb.ReleaseStockRequest) (*pb.ReleaseStockResponse, error){
	log.Printf("Received Release Stock Request")
	return &pb.ReleaseStockResponse{
		Success: true,
	}, nil
}

func main(){
	lis, err := net.Listen("tcp", port)
	if err != nil{
		log.Fatalf("failed to listen: %v", err)
	}	

	s := grpc.NewServer()
	pb.RegisterStockServiceServer(s, &server{})
	if err := s.Serve(lis); err != nil{
		log.Fatalf("failed to serve : %v ", err)
	}
}
