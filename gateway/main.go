package main

import (
    "log"
    "fmt"

    "google.golang.org/grpc"

    pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
    "net/http"
    "google.golang.org/grpc/credentials/insecure"
    "github.com/rgarcia2304/recipe-marketplace/gateway/handler"
)

const (
	address = "localhost:9001"
	port = ":8080"
)


func main(){
	conn, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil{
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewOrdersServiceClient(conn)
	h := handler.NewGatewayHandler(c)
	mux := http.NewServeMux()
	mux.HandleFunc("POST /orders", h.CreateOrder)

	s := &http.Server{
		Addr: port, 
		Handler: mux,
	}

	fmt.Println("Serving orders")
	log.Fatal(s.ListenAndServe())
	
}
