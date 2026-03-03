package service 

import(
	"context"
	"fmt"
	"github.com/rgarcia2304/recipe-marketplace/payment/api"
)

type PaymentService{
	api *api.CreatePayment
}

func NewPaymentService (api *api.CreatePayment) *PaymentService{
	return &PaymentService{api: api}
}

func (p *PaymentService) CreatePayment(ctx context.Context, orderMsg []bytes) ([]byte, error){
	
	//call the api service with the given paremeters 

	resp, err := api.CreatePayment(ctx, orderMsg)
	if err != nil{
		return nil, fmt.Errorf("failed to create order: %w", err)
	}
	
	//depending on response in creating the service progress the service in rabbitMQ
	// if creating the payment fails the order is stuck in this part for users
	//if the payment creation than we can proceed to that of transaction service 
	//going to assume that the stripe webhook will return sometype of json response
	return resp, err 
}
