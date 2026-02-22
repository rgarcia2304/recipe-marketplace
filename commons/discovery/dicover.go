package commmons 

import(
	"fmt"
	"log"
	"time"
	"github.com/hashicorp/consul/api"
)


func (c *Client) Register(cfg Config) error{
	
	registration := &api.AgentServiceRegistration{
		ID: cfg.ServiceID, 
		Name: cfg.ServiceName, 
		Address: cfg.SerAdress,
		Port: cfg.Port,
	}

	err := c.consul.Agent().ServiceRegister(registration)
	if err != nil{
		return fmt.Errorf("failed to register service: %w", err)
	}

	log.Printf("Registered service %s with ID %s", cfg.ServiceName, cfg.ServiceID)
	return nil
}

