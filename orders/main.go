package main

import(
    	"log"
    	"net"

    	"google.golang.org/grpc"

    	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	"github.com/rgarcia2304/recipe-marketplace/orders/service"
	"github.com/rgarcia2304/recipe-marketplace/orders/handler"
	"google.golang.org/grpc/credentials/insecure"

)

const(
	port = ":9001"
)

func main(){
	lis, err := net.Listen("tcp", port)
	if err != nil{
		log.Fatalf("failed to listen: %v", err)
	}
	stockConn, _ := grpc.Dial("localhost:9003", grpc.WithTransportCredentials(insecure.NewCredentials()))
	stockClient := pbStock.NewStockServiceClient(stockConn)
	svc := service.NewOrdersService(stockClient)
	h := handler.NewOrdersHandler(svc)

	s := grpc.NewServer()
	pb.RegisterOrdersServiceServer(s, h)
	

	if err := s.Serve(lis); err != nil{
		log.Fatalf("failed to serve: %v", err)
	}

}
