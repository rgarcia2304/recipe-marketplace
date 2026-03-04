package service

import(
	"github.com/rgarcia2304/recipe-marketplace/commons/broker"
	"github.com/rgarcia2304/recipe-marketplace/commons/events"
	"github.com/rgarcia2304/recipe-marketplace/fulfillment/api"
	"fmt"
	"log"
)

type FulfillmentService struct{
	broker *broker.Broker
}

func NewFulfillmentService(broker *broker.Broker) *FulfillmentService{
		return &FulfillmentService{broker: broker}
}
func(s* FulfillmentService) ProcessOrder(order events.OrderPaidEvent) error{
	

	log.Printf("Processing order %v for a total of %v", order.OrderID, order.TotalCents)

	//now create the URL event from the file you are passing
	urls := createURLS(order.Items)
	log.Printf("Recipe URLS: %v", urls)
	// send the email


	err := api.ResendApi(order.Email, urls)
	if err != nil{
		return fmt.Errorf("issue sending email: %w", err)
	}
	err = s.broker.Publish("order.fulfilled", events.OrderFulfilledEvent{
		OrderID: order.OrderID,
		CustomerID: order.CustomerID,
	})
	if err != nil{
		return fmt.Errorf("error fullfilling order: %w", err)
	}
	return nil
}

func createURLS(items []events.OrderEventItem ) []string {
	
	paths := make([]string, len(items))
	for i, item := range items{
		paths[i] = fmt.Sprintf("recipes/%s.html", item.ListingID)
	}

	return paths
}
