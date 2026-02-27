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
	ReserveStock(ctx context.Context, listingID string, quantity int32) (error)
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

func(s *StockRepository) ReserveStock(ctx context.Context,listingID string, quantity int32) (error){
	filter := bson.D{{Key: "_id", Value: listingID}}
	update := bson.D{{"$inc", bson.D{{"quantity", -quantity}}}}
	_, err := s.collection.UpdateOne(ctx, filter, update)
	if err != nil{
		return fmt.Errorf("could not update stock on recipe: %w", err)
	}
	
	return nil
}
