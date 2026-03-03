package main

import(
    	"log"
    	"net"

    	"google.golang.org/grpc"

    	pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
	pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
	"github.com/rgarcia2304/recipe-marketplace/orders/service"
	"github.com/rgarcia2304/recipe-marketplace/orders/handler"
	"github.com/rgarcia2304/recipe-marketplace/orders/db"
	"github.com/rgarcia2304/recipe-marketplace/orders/repository"
	"google.golang.org/grpc/credentials/insecure"
	"github.com/joho/godotenv"
	"os"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rgarcia2304/recipe-marketplace/commons/broker"
)

const(
	port = ":9001"
)

func main(){
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Error loading .env file")
	}
	
	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil{
		log.Fatalf("failed to connect to database: %v ", err)
	}

	defer pool.Close()
	log.Println("Connected to database")
	queries := db.New(pool)
	lis, err := net.Listen("tcp", port)
	if err != nil{
		log.Fatalf("failed to listen: %v", err)
	}

	//create a new broker to connect to 
	b, err := broker.NewBroker(os.Getenv("RABBITMQ_URL"))
	if err != nil{
		log.Fatalf("failed to establish connection with rabbitMQ")
	}
	defer b.Close()


	stockConn, _ := grpc.Dial("localhost:9003", grpc.WithTransportCredentials(insecure.NewCredentials()))

	repo := repository.NewRepositoryService(queries, pool)
	stockClient := pbStock.NewStockServiceClient(stockConn)
	svc := service.NewOrdersService(stockClient, repo, b)
	h := handler.NewOrdersHandler(svc)

	s := grpc.NewServer()
	pb.RegisterOrdersServiceServer(s, h)
	

	if err := s.Serve(lis); err != nil{
		log.Fatalf("failed to serve: %v", err)
	}

}
