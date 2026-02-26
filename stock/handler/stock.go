package handler 

import(
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	"github.com/rgarcia2304/recipe-marketplace/stock/service"
	"context"
)

type StockHandler struct{
	service *service.StockService
	pbStock.UnimplementedStockServiceServer
}	

func NewStockHandler(svc *service.StockService) *StockHandler{
	return &StockHandler{service: svc}
}
func (s *StockHandler) CheckAvailability(ctx context.Context, in *pbStock.CheckAvailabilityRequest)(*pbStock.CheckAvailabilityResponse, error){
	return s.service.CheckAvailability(ctx, in.Items)
}
