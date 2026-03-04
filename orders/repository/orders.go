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

type OrderStatus = db.OrderStatus
const (
    StatusPending   = db.OrderStatusPending
    StatusPaid      = db.OrderStatusPaid
    StatusFulfilled = db.OrderStatusFulfilled
    StatusCancelled = db.OrderStatusCancelled
)

type OrderRepositoryInterface interface{
	CreateOrder(ctx context.Context, input CreateOrderInput) (*db.Order, error)
	GetOrder(ctx context.Context, id string) (*db.Order, error)
	UpdateOrderStatus(ctx context.Context, id string, status string) 
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

type OrderWithItems struct{
	Order *db.Order
	Items []OrderItemInput
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

func( r *OrdersRepository) GetOrder(ctx context.Context, id string) (*OrderWithItems, error){
	parsedUUID, err := uuid.Parse(id)
	if err != nil{
		return nil, fmt.Errorf("invalid order id: %w", err)
	}
	var orderUUID pgtype.UUID
	copy(orderUUID.Bytes[:], parsedUUID[:])
	orderUUID.Valid = true
	order, err := r.queries.GetOrder(ctx, orderUUID)
	if err != nil{
		return nil, fmt.Errorf("Order was not found with given id: %v", err)
	}
	items, err := r.queries.GetOrderItems(ctx, orderUUID)
	if err != nil{
		return nil, fmt.Errorf("Order with these items was not found: %v", err)
	}
	return &OrderWithItems{Order: order, Items: items}, nil

}


func( r *OrdersRepository) UpdateOrderStatus(ctx context.Context, id string, status db.OrderStatus) (*db.Order, error){
	parsedUUID, err := uuid.Parse(id)
	if err != nil{
		return nil, fmt.Errorf("invalid order id: %w", err)
	}
	var orderUUID pgtype.UUID
	copy(orderUUID.Bytes[:], parsedUUID[:])
	orderUUID.Valid = true


	order, err := r.queries.UpdateOrderStatus(ctx, db.UpdateOrderStatusParams{
		ID: orderUUID,
		Status: db.NullOrderStatus{
			OrderStatus: status,
			Valid: true,
		},
	})

	if err != nil{
		return nil, fmt.Errorf("Order was not found with given id: %v", err)
	}
	
	return &order, nil

}


