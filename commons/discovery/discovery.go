package discovery


import(
	"fmt"
	"log"
	"github.com/hashicorp/consul/api"
)


func (c *Client) Register(cfg Config) error{
	
	registration := &api.AgentServiceRegistration{
		Name: cfg.ServiceName,
		Port: cfg.Port,
		Address: cfg.ServiceAddress,
		ID: cfg.ServiceID,
	}

	err := c.consul.Agent().ServiceRegister(registration)
	if err != nil{
		return fmt.Errorf("failed to register service: %w", err)
	}

	log.Printf("Registered service %s with ID %s", cfg.ServiceName, cfg.ServiceID)
	return nil
}

func (c *Client) Deregister() error{
	err := c.consul.Agent().ServiceDeregister(c.serviceID)
	if err != nil{
		return fmt.Errorf("failed to deregister service: %w", err)
	}

	log.Printf("Deregistered service with ID %s", c.serviceID)
	return nil
}


func (c *Client) GetServiceAddress(serviceName string) (string, error){
	services, _, err := c.consul.Health().Service(serviceName, "", true, nil)
	if err != nil{
		return "", fmt.Errorf("failed to discover service %s: %w", serviceName, err)
	}

	if len(services) == 0{
		return "", fmt.Errorf("No healthy instances found for service %s", serviceName)
	}

	entry := service[0]
	return fmt.Sprintf("%s:%d", entry.Service.Address, entry.Service.Port), nil
}
