FROM golang:1.25-alpine AS builder
WORKDIR /app

COPY go.work go.work.sum ./

COPY commons/ commons/
COPY proto/ proto/
COPY orders/ orders/
COPY gateway/ gateway/
COPY stock/ stock/
COPY fulfillment/ fulfillment/


RUN go work sync
RUN go work sync && cd stock && go mod download

WORKDIR /app/stock
RUN go build -o stock .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/stock/stock .
EXPOSE 9003
CMD ["./stock"]
