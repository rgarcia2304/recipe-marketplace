package discovery

import (
    "fmt"
    consul "github.com/hashicorp/consul/api"
)

func RegisterService(serviceID, serviceName, address string, port int) error {
    config := consul.DefaultConfig()
    client, err := consul.NewClient(config)
    if err != nil {
        return fmt.Errorf("failed to create consul client: %w", err)
    }

    registration := &consul.AgentServiceRegistration{
        ID:      serviceID,
        Name:    serviceName,
        Address: address,
        Port:    port,
        Check: &consul.AgentServiceCheck{
            TCP:     fmt.Sprintf("%s:%d", address, port),
            Interval: "15s",
            Timeout:  "10s",
	    DeregisterCriticalServiceAfter: "30s",
        },
    }

    return client.Agent().ServiceRegister(registration)
}

func DeregisterService(serviceID string) error {
    config := consul.DefaultConfig()
    client, err := consul.NewClient(config)
    if err != nil {
        return fmt.Errorf("failed to create consul client: %w", err)
    }
    return client.Agent().ServiceDeregister(serviceID)
}

func GetServiceAddress(serviceName string) (string, error) {
    config := consul.DefaultConfig()
    client, err := consul.NewClient(config)
    if err != nil {
        return "", fmt.Errorf("failed to create consul client: %w", err)
    }

    services, _, err := client.Health().Service(serviceName, "", true, nil)
    if err != nil {
        return "", fmt.Errorf("failed to find service %s: %w", serviceName, err)
    }

    if len(services) == 0 {
        return "", fmt.Errorf("no healthy instances of %s found", serviceName)
    }

    service := services[0].Service
    return fmt.Sprintf("%s:%d", service.Address, service.Port), nil
}
