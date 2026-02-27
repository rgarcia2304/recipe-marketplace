package service 

import(
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	"context"
	"fmt"
	"github.com/rgarcia2304/recipe-marketplace/stock/repository"
)

type StockService struct{
	repo *repository.StockRepository
}

func NewStockService(repo *repository.StockRepository) *StockService{
	return &StockService{repo: repo}
}

func (s *StockService) CheckAvailability(ctx context.Context, items []*pbStock.StockItem) (*pbStock.CheckAvailabilityResponse, error){
	
	//loop through our items and get a list of items
	isAvailable := true
	var unavailableIDs []string

	for _, item := range items{
		available, err := s.repo.CheckItemAvailability(ctx, item.ListingId, item.Quantity)
		if err != nil{
			return nil, fmt.Errorf("failed to check stock: %w", err)
		}

		if !available{
			isAvailable = false
			unavailableIDs = append(unavailableIDs, item.ListingId)
		}else{
			err = s.repo.ReserveStock(ctx, item.ListingId, item.Quantity)
			if err != nil{
				return nil, fmt.Errorf("failed to release stock: %w", err)
			}
		}
	}
	
	
	return &pbStock.CheckAvailabilityResponse{
		Available: isAvailable,
		UnavailableIds: unavailableIDs,
	}, nil
	//return the response from the database 
}
