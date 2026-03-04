package api

import (
    "log"

    "github.com/resend/resend-go/v3"
    "os"
    "fmt"
)


func ResendApi(email string, urls []string) (error){
	
    apiKey := os.Getenv("RESEND_API_KEY")
    client := resend.NewClient(apiKey)
    
    attachments := make([]*resend.Attachment, len(urls))

    for i, url := range urls{
	fileData, err:= os.ReadFile(url)
	if err != nil{
		return fmt.Errorf("recipe file not found: %w", err)
	}
	attachments[i] = &resend.Attachment{
		Content: fileData,
		Filename:"recipe",
	}
    }
   
    log.Printf(email)
    params := &resend.SendEmailRequest{
        From:    "onboarding@resend.dev",
        To:      []string{email},
        Subject: "Recipe",
        Html:    "<h1>Your recipes are attached</h1>",
	Attachments: attachments,
    }

    sent, err := client.Emails.Send(params)
    if err != nil {
        return fmt.Errorf("failed to send email: %v", err)
    }

    log.Printf("email sent: %s", sent.Id)
    return nil
}
