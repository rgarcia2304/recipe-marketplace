package events

type OrderCreatedEvent struct{
	OrderID string  `json:"order_id"`
	CustomerID string `json:"customer_id"`
	Items []OrderEventItem `json:"items"`
	TotalCents int32	`json:"total_cents"`
	Email string `json:"email"`
}

type OrderPaidEvent struct{
	OrderID string  `json:"order_id"`
	CustomerID string `json:"customer_id"`
	Items []OrderEventItem `json:"items"`
	TotalCents int32	`json:"total_cents"`
	PaymentIntentID string `json"payment_intent_id"`
	Email string `json:"email"`
}

type OrderFulfilledEvent struct{
	OrderID string  `json:"order_id"`
	CustomerID string `json:"customer_id"`
	Items []OrderEventItem `json:"items"`
	TotalCents int32	`json:"total_cents"`
	DownloadURL string `json:"download_url"`
}

type OrderCancelledEvent struct{
	OrderID string  `json:"order_id"`
	CustomerID string `json:"customer_id"`
	Items []OrderEventItem `json:"items"`
	TotalCents int32	`json:"total_cents"`
}

type OrderEventItem struct{
	ListingID string	`json:"listing_id"`
	Name string	`json:"name"`
	PriceCents int32	`json:"price_cents"`
	Quantity int32		`json:"quantity"`
}
