package main

import(
	"context"
    	"net"
	"log"

    	"google.golang.org/grpc"

	"github.com/rgarcia2304/recipe-marketplace/stock/service"
	"github.com/rgarcia2304/recipe-marketplace/stock/handler"
	"github.com/rgarcia2304/recipe-marketplace/stock/repository"
	"os"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/joho/godotenv"
	pb "github.com/rgarcia2304/recipe-marketplace/proto/stock"
)

const(
	port = ":9003"
)

func main(){
	lis, err := net.Listen("tcp", port)
	if err != nil{
		log.Fatalf("failed to listen: %v", err)
	}	
	
	//here implement all the mongo db connection logic 
	//Here we need to connect to mongoDB database with a client and pass that to the repository eventually.

	err = godotenv.Load("../.env") 
	if err != nil{
		log.Println("Error loading .env file")
	}

	var uri string
	if uri = os.Getenv("MONGODB_URI");uri == ""{
		log.Fatal("You must set your 'MONGODB_URI' environment variable")
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))

	if err != nil{
		log.Fatal("Failed to create MongoDB client")
	}

	defer func(){
		if err := client.Disconnect(context.Background()); err != nil{
			log.Fatalf("issue with disconnection: %w", err)
		}
	}()

	coll := client.Database("recipe-marketplace").Collection("listings")
	repo := repository.NewRepositoryService(coll)
	svc := service.NewStockService(repo)
	h := handler.NewStockHandler(svc)

	s := grpc.NewServer()
	pb.RegisterStockServiceServer(s, h)
	if err := s.Serve(lis); err != nil{
		log.Fatalf("failed to serve : %v ", err)
	}

	}
