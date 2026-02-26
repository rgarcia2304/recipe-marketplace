package repository

import(
	"github.com/rgarcia2304/recipe-marketplace/orders/db"
	"github.com/jackc/pgx/v5/pgxpool"
	"context"
	"github.com/jackc/pgx/v5/pgtype"
	"fmt"
	"github.com/google/uuid"
	"log"

)
type OrdersRepository struct{
	queries *db.Queries
	pool *pgxpool.Pool
}

type OrderRepositoryInterface interface{
	CreateOrder(ctx context.Context, input CreateOrderInput) (*db.Order, error)
	GetOrder(ctx context.Context, id string) (*db.Order, error)
}

func NewRepositoryService(q *db.Queries, p *pgxpool.Pool) *OrdersRepository{
	return &OrdersRepository{queries: q, pool: p}
}

type CreateOrderInput struct{
	CustomerID string
	TotalPriceCents int32
	Items []OrderItemInput
}

type OrderItemInput struct{
	ListingID string
	Quantity int32
	PriceCents int32
}

func(r *OrdersRepository) CreateOrder(ctx context.Context, input CreateOrderInput) (*db.Order, error){
	tx, err := r.pool.Begin(ctx)
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)

	order, err := r.createOrder(ctx, qtx, input)
	if err != nil{
		return nil, err 
	}

	tx.Commit(ctx)
	return order, nil
}

func( r *OrdersRepository) createOrder(ctx context.Context, qtx *db.Queries, input CreateOrderInput)(*db.Order, error){

	order, err := qtx.CreateOrder(ctx, db.CreateOrderParams{
		CustomerID: input.CustomerID,
		TotalPriceCents: input.TotalPriceCents,
	})

	if err != nil{
		return nil, err
	}

	for _, item := range input.Items{
		log.Printf("parsing UUID: %q", item.ListingID)
		parsedUUID, err := uuid.Parse(item.ListingID)
		if err != nil{
			return nil, fmt.Errorf("invalid listing_id UUID: %w", err)
		}
		var listingUUID pgtype.UUID
		copy(listingUUID.Bytes[:], parsedUUID[:])
		listingUUID.Valid = true
		_, err = qtx.CreateItem(ctx, db.CreateItemParams{
			OrderID: order.ID,
			ListingID: listingUUID,
			PriceCents: item.PriceCents,
			Quantity: item.Quantity,
		})
		if err != nil{
			return nil, err	
		}
		
	}

	return &order, nil
}
