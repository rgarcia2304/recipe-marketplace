package service
import(
	"context"
    "testing"
    pbStock "github.com/rgarcia2304/recipe-marketplace/proto/stock"
    pb "github.com/rgarcia2304/recipe-marketplace/proto/orders"
    "github.com/rgarcia2304/recipe-marketplace/orders/db"
    "github.com/rgarcia2304/recipe-marketplace/orders/repository"
)



type SpyBroker struct{
	Called bool
	RoutingKey string
	Event any
}

func (s *SpyBroker) Publish(routingKey string, event any) error{
	s.Called = true
	return nil
}

type SpyStockClient struct{
	Called bool
	ctx context.Context
	Req *pbStock.CheckAvailabilityRequest
	AvailToReturn bool 
}

func(s *SpyStockClient) CheckAvailability(ctx context.Context, req *pbStock.CheckAvailabilityRequest) (*pbStock.CheckAvailabilityResponse, error){
	s.Called = true
	s.ctx = ctx
	s.Req = req
	return &pbStock.CheckAvailabilityResponse{
		Available: s.AvailToReturn,
	}, nil
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



