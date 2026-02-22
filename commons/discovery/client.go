package discovery

import(
	"fmt"
	"log"
	"time"
	"github.com/hashicorp/consul/api"
)

type Client struct{
	consul *api.Client
	serviceID string
}

type Config struct{
	ServiceName string
	ServiceID string
	ServiceAddress string
	Port int
}

func NewClient(cfg Config) (*Client, error){
	consulConfig := api.DefaultConfig()

	consul, err := api.NewClient(consulConfig)
	if err != nil{
		return nil, fmt.Errorf("failed to create consul client: %w", err)
	}

	return &Client{
		consul: consul,
		serviceID: cfg.ServiceID,
	}, nil
}
