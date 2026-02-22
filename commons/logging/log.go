package logger 

import( 
	"os"
	"github.com/rs/zerolog"
)

func NewLogger(service string) zerolog.Logger{
	logger := zerolog.New(os.Stdout)
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	logger = logger.With().Timestamp().Str("service", service).Logger()
	return logger
}
