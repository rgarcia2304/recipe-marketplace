package handler

import(
	"github.com/rgarcia2304/recipe-marketplace/payment/service"
)

type PaymentHandler struct{
	service *service.PaymentService
}

func NewPaymentHandler(svc *service.PaymentService) *PaymentHandler{
	return &PaymentHandler{service: svc}
}

func (p *PaymentHandler) CreatePayment(ctx context.Context, publishedMsg []byte) (error){
	
	return p.service.CreatePayment(ctx, publishedMsg)
}
