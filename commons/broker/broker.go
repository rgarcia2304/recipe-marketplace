package broker

import(
	"log"
    	amqp "github.com/rabbitmq/amqp091-go"
	"context"
	"encoding/json"
	"fmt"

)

type Broker struct{
	conn *amqp.Connection
	channel *amqp.Channel
}

func NewBroker(amqpURL string) (*Broker, error){
	conn, err := amqp.Dial(amqpURL)
	if err != nil{
		log.Fatalf("Failed to Dial with string: %v", err)
	}
	ch, err := conn.Channel()
	if err != nil{
		log.Fatalf("Failed to connect to channel: %v", err)
	}

	if err := setupQueues(ch); err != nil{
		return nil, err
	}

	return &Broker{conn: conn, channel: ch}, nil
}

func (b *Broker) Close(){
	b.channel.Close()
	b.conn.Close()
}


func setupQueues(ch *amqp.Channel) error{
	// connect to the channel 
	err := ch.ExchangeDeclare(
		"orders_topic",
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil{
		return err
	}

	_, err = ch.QueueDeclare("all_order_events", true, false, false, false, nil)
	if err != nil{
		return err	
	}

	err = ch.QueueBind(
		"all_order_events",
		"order.*",
		"orders_topic",
		false,
		nil,
	)
	if err != nil{
		return err
	}

	//set up deadletter exchange
	if err = ch.ExchangeDeclare("orders_dlx", "direct", true, false, false, false, nil); err != nil{
		return err
	}

	 if _, err := ch.QueueDeclare("orders_dlq", true, false, false, false, nil); err != nil {
        	return err
    	 }

	if err := ch.QueueBind("orders_dlq", "orders", "orders_dlx", false, nil); err != nil{
		return err
	}

	_, err = ch.QueueDeclare(
		"orders",
		true,
		false,
		false,
		false,
		amqp.Table{
			"x-dead-letter-exchange": "orders_dlx",
			"x-dead-letter-routing-key": "orders",
		},
	)

	if err != nil{
		return err
	}

	log.Println("Queues and exchanges configured successfully")
	return nil
}

func (b *Broker) Publish(routingKey string, event any) error{
	
	data, err := json.Marshal(event)
	if err != nil{
		return fmt.Errorf("Could not marshall event to JSON %w", err)
	}

	ctx := context.Background()
	return b.channel.PublishWithContext(
		ctx,
		"orders_topic",
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body: data,
		},
	)

		
}
