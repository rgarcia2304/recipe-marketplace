package repository 

import(
	"context"
    	"fmt"
    	"go.mongodb.org/mongo-driver/bson"
    	"go.mongodb.org/mongo-driver/mongo"
)


type Listing struct{
	ID string `bson:"_id"`
	Name string `bson:"name"`
	Price float64 `bson:"price"`
	Quantity int32 `bson:"quantity"`
	Body string `bson:"body"`
}

type StockInput struct{
	ID string `bson:"_id"`
	Quantity int32 `bson:"quantity"`
}

type StockRepository struct{
	collection *mongo.Collection
}

func NewRepositoryService(c *mongo.Collection) *StockRepository{
	return &StockRepository{collection: c}
}

type StockRepositoryInterface interface{
	CheckAvailability(ctx context.Context, listingID string, quantity int32) (*Listing, error)
}

func(s *StockRepository) CheckItemAvailability(ctx context.Context, listingID string, quantity int32) (bool, error){
	filter := bson.D{{Key: "_id", Value: listingID}}
	var listing Listing
	err := s.collection.FindOne(ctx, filter).Decode(&listing)
	if err != nil{
		return false, fmt.Errorf("could not find a recipe with this id: %w", err)
	}
	
	return listing.Quantity >= quantity,  nil
}
