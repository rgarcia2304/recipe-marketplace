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
	"github.com/stripe/stripe-go/v79"
	"github.com/rgarcia2304/recipe-marketplace/commons/discovery"
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
	
	err = discovery.RegisterService("orders", "orders", os.Getenv("LOCAL_IP"), 9001)
	if err != nil{
		log.Fatalf("failed to register with consul: %v", err)
	}
	defer discovery.DeregisterService("orders")

	lis, err := net.Listen("tcp", port)
	if err != nil{
		log.Fatalf("failed to listen: %v", err)
	}

	//load in stripe key
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	//create a new broker to connect to 
	b, err := broker.NewBroker(os.Getenv("RABBITMQ_URL"))
	if err != nil{
		log.Fatalf("failed to establish connection with rabbitMQ")
	}
	defer b.Close()

	stockAddr, err := discovery.GetServiceAddress("stock")
	if err != nil{
		log.Fatalf("issue getting service address stock %v", err)
	}

	stockConn, _ := grpc.Dial(stockAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))

	repo := repository.NewRepositoryService(queries, pool)
	stockClient := pbStock.NewStockServiceClient(stockConn)
	svc := service.NewOrdersService(repo, b, stock)
	h := handler.NewOrdersHandler(svc)

	s := grpc.NewServer()
	pb.RegisterOrdersServiceServer(s, h)
	

	if err := s.Serve(lis); err != nil{
		log.Fatalf("failed to serve: %v", err)
	}

}
