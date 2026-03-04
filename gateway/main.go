package main

import (
    "log"
    "fmt"

    "google.golang.org/grpc"

    pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
    "net/http"
    "google.golang.org/grpc/credentials/insecure"
    "github.com/rgarcia2304/recipe-marketplace/gateway/handler"
    "github.com/stripe/stripe-go/v79"
    "os"
    "github.com/joho/godotenv"
    "github.com/rgarcia2304/recipe-marketplace/commons/broker"

)

const (
	address = "localhost:9001"
	port = ":8080"
)

func main(){
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	b, err := broker.NewBroker(os.Getenv("RABBITMQ_URL"))
	if err != nil{
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer b.Close()

	conn, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil{
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewOrdersServiceClient(conn)
	h := handler.NewGatewayHandler(c, b)
	mux := http.NewServeMux()
	mux.HandleFunc("POST /orders", h.CreateOrder)
	mux.HandleFunc("POST /webhook", h.StripeWebhook)

	s := &http.Server{
		Addr: port, 
		Handler: mux,
	}
	fmt.Println("Serving orders")
	log.Fatal(s.ListenAndServe())
	
}
