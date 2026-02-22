package main

import (
    "context"
    "log"
    "os"
    "time"

    "google.golang.org/grpc"

    pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
    "net/http"
)

const (
	address = "localhost:9001"
	port = ":8080"
)

func main(){
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil{
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewOrdersServiceClient(conn)

	mux := http.NewServeMux()
	mux.HandleFunc("POST /orders", CreateOrderHandler)
	s := &http.Server{
		Addr: port,
		Handler: mux, 
	}

	
}
