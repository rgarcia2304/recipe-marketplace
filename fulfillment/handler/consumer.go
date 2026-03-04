package handler 

//consume the rabbitMQ events 
import(
	"github.com/rgarcia2304/recipe-marketplace/commons/broker"
	"github.com/rgarcia2304/recipe-marketplace/fulfillment/service"
	"log"
	"encoding/json"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rgarcia2304/recipe-marketplace/commons/events"
)
type ConsumerHandler struct{
	broker *broker.Broker
	service *service.FulfillmentService
}

func NewConsumerHandler(b *broker.Broker, svc *service.FulfillmentService) *ConsumerHandler{
	return &ConsumerHandler{broker: b, service: svc }
}


func (c *ConsumerHandler) StartConsuming(){
	deliveries, err := c.broker.Consume("all_order_events")
	if err != nil{
		log.Fatalf("failed to start consuming: %v", err)
	}
	c.consumeLoop(deliveries)
}	
func (c *ConsumerHandler) consumeLoop(deliveries <-chan amqp.Delivery){
	for {

		select{
		
		case delivery, ok := <-deliveries:
			if !ok{
				log.Printf("Delivery Channel Closed")
				return
			}

			if delivery.RoutingKey != "order.paid" {
        			delivery.Ack(false)  // acknowledge and skip
       				 continue
    			}
			//call the service to process this order 
			var order events.OrderPaidEvent
			if err := json.Unmarshal(delivery.Body, &order); err != nil{
				log.Printf("Failed to parse order: %v", err)
				delivery.Reject(false)
				continue
			}
			//now call the service
			err := c.service.ProcessOrder(order)
			if err != nil{
				log.Printf("Issue processing order: %v", err)
				delivery.Nack(false, false)
				continue
			}
			delivery.Ack(false)
		}
	}
}
