package main

import(
	"os"
	"github.com/joho/godotenv"
)

func main(){
	
	//load the stripe API keys 
	err = godotenv.Load("../.env")
	stipeKey := os.Getenv("STRIPE_API_KEY")

}
