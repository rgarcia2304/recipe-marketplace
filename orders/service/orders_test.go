package service
import(
	"context"
    "testing"
    pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
    pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
    "github.com/rgarcia2304/recipe-marketplace/orders/db"
    "github.com/rgarcia2304/recipe-marketplace/orders/repository"
    "errors"
    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgtype"
    "os"
    "google.golang.org/grpc"
)



type SpyBroker struct{
	ErrToReturn error
	Called bool
	RoutingKey string
	Event any
}

func (s *SpyBroker) Publish(routingKey string, event any) error{
	s.Called = true
	return s.ErrToReturn
}

type SpyStockClient struct{
	Called bool
	ctx context.Context
	Req *pbStock.CheckAvailabilityRequest
	AvailToReturn bool
	ErrToReturn error
}

func(s *SpyStockClient) CheckAvailability(ctx context.Context, req *pbStock.CheckAvailabilityRequest, opts ...grpc.CallOption) (*pbStock.CheckAvailabilityResponse, error){
	s.Called = true
	s.ctx = ctx
	s.Req = req
	return &pbStock.CheckAvailabilityResponse{
		Available: s.AvailToReturn,
	}, s.ErrToReturn
}

type SpyRepo struct{
	CreateOrderCalled bool
	OrderToReturn *db.Order
	ErrToReturn error
	
	GetOrderCalled bool

	UpdateOrderCalled bool
}


func( s *SpyRepo) CreateOrder(ctx context.Context, input repository.CreateOrderInput) (*db.Order, error){
	s.CreateOrderCalled = true
	return s.OrderToReturn, s.ErrToReturn
}

func (s *SpyRepo) GetOrder(ctx context.Context, orderID string) (*repository.OrderWithItems, error) {
    s.GetOrderCalled = true
    return nil, nil
}

func (s *SpyRepo) UpdateOrderStatus(ctx context.Context, orderID string, status repository.OrderStatus) (*db.Order, error) {
    s.UpdateOrderCalled = true
    return nil, nil
}

func TestCreateOrder_StockUnavailable(t *testing.T){
	stk := &SpyStockClient{AvailToReturn: false}
	b := &SpyBroker{Called: false}
	r := &SpyRepo{}
	svc := NewOrdersService(r, b, stk)

	got, err := svc.CreateOrder(
    		context.Background(),  // note the () — it's a function call
   		 "cust_123",
    		"test@test.com",
    		[]*pb.OrderItem{
        		{ListingId: "some-id", Quantity: 1, Price: 10.00},
    		},
	)

	if got != nil{
		t.Error("expected nil response")
	}

	if err == nil{
		t.Error("expected an error")
	}

	if r.CreateOrderCalled{
		t.Error("repo should not have been called")
	}
}

func TestCreateOrder_StockServiceDown( t *testing.T){
	stk := &SpyStockClient{ErrToReturn: errors.New("stock service down")}
	b := &SpyBroker{Called: false}
	r := &SpyRepo{}
	svc := NewOrdersService(r, b, stk)

	got, err := svc.CreateOrder(
    		context.Background(),  // note the () — it's a function call
   		 "cust_123",
    		"test@test.com",
    		[]*pb.OrderItem{
        		{ListingId: "some-id", Quantity: 1, Price: 10.00},
    		},
	)
	if got != nil{
		t.Error("Expected nil response")
	}
	if err == nil{
		t.Error("Expected an error")
	}

	if r.CreateOrderCalled{
		t.Error("repo should not have been called")
	}

}

func TestCreateOrder_RepoServiceDown( t *testing.T){
	stk := &SpyStockClient{AvailToReturn: true}
	b := &SpyBroker{Called: false}
	r := &SpyRepo{ErrToReturn: errors.New("repo service down")}
	svc := NewOrdersService(r, b, stk)

	got, err := svc.CreateOrder(
    		context.Background(),  // note the () — it's a function call
   		 "cust_123",
    		"test@test.com",
    		[]*pb.OrderItem{
        		{ListingId: "some-id", Quantity: 1, Price: 10.00},
    		},
	)
	if got != nil{
		t.Error("Expected nil response")
	}
	if err == nil{
		t.Error("Expected an error")
	}

	if b.Called{
		t.Error("broker should not have been called")
	}

}

func TestCreateOrder_BrokerServiceDown( t *testing.T){

	fakeID := uuid.New()
	var fakeUUID pgtype.UUID
	copy(fakeUUID.Bytes[:], fakeID[:])
	fakeUUID.Valid = true

	fakeOrder := &db.Order{
    		ID:              fakeUUID,
    		TotalPriceCents: 1000,
    		CustomerID:      "cust_123",
		Email: "test@test.com",
	}

	stk := &SpyStockClient{}
	b := &SpyBroker{ErrToReturn: errors.New("broker service down")}
	r := &SpyRepo{OrderToReturn: fakeOrder}
	svc := NewOrdersService(r, b, stk)

	

	got, err := svc.CreateOrder(
    		context.Background(),  // note the () — it's a function call
   		 "cust_123",
    		"test@test.com",
    		[]*pb.OrderItem{
        		{ListingId: "some-id", Quantity: 1, Price: 10.00},
    		},
	)
	if got != nil{
		t.Error("Expected nil response")
	}
	if err == nil{
		t.Error("Expected an error")
	}

}


func TestCreateOrder_FullOrderFlow( t *testing.T){

	stripeKey := os.Getenv("STRIPE_TEST_KEY")
    	if stripeKey == "" {
        	t.Skip("skipping happy path — STRIPE_TEST_KEY not set")
   	 }
	stk := &SpyStockClient{AvailToReturn: true}
	b := &SpyBroker{}

	fakeID := uuid.New()
	var fakeUUID pgtype.UUID
	copy(fakeUUID.Bytes[:], fakeID[:])
	fakeUUID.Valid = true

	fakeOrder := &db.Order{
    		ID:              fakeUUID,
    		TotalPriceCents: 1000,
    		CustomerID:      "cust_123",
    		Email:           "test@test.com",
	}

	r := &SpyRepo{OrderToReturn: fakeOrder }
	svc := NewOrdersService(r, b, stk)

	_, err := svc.CreateOrder(
    		context.Background(),  // note the () — it's a function call
   		 "cust_123",
    		"test@test.com",
    		[]*pb.OrderItem{
        		{ListingId: "some-id", Quantity: 1, Price: 10.00},
    		},
	)
	
	if err != nil{
		t.Error("Did Not Expect Error")
	}

}






