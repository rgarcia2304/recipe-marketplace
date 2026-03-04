package main 

import(
"github.com/rgarcia2304/recipe-marketplace/commons/broker"
"log"
"os"
"github.com/joho/godotenv"
"github.com/rgarcia2304/recipe-marketplace/fulfillment/handler"
"github.com/rgarcia2304/recipe-marketplace/fulfillment/service"
)


func main(){


	//initialize the broker and connect to it 
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//at this point we are occnnected to the broker
	b, err := broker.NewBroker(os.Getenv("RABBITMQ_URL"))
	if err != nil{
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer b.Close()

	
	s := service.NewFulfillmentService(b)
	h := handler.NewConsumerHandler(b, s)
	h.StartConsuming()

}
