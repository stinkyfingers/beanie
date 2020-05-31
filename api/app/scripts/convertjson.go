package main

import (
	"encoding/csv"
	"io"
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func main() {
	err := do()
	if err != nil {
		log.Fatal(err)
	}

}

type Beanie struct {
	Name      string `json:"name"`
	Animal    string `json:"animal"`
	Family    string `json:"family"`
	Thumbnail string `json:"thumbnail"`
}

func do() error {
	options := session.Options{}
	sess, err := session.NewSessionWithOptions(options)
	if err != nil {
		return err
	}

	sess.Config.WithRegion("us-west-1")
	sess.Config.Endpoint = aws.String("http://localhost:8000")
	f, err := os.Open("beanieboos.csv")
	if err != nil {
		return err
	}
	defer f.Close()
	reader := csv.NewReader(f)
	var header bool = true
	for {
		r, err := reader.Read()
		if err != nil {
			if err == io.EOF {
				break
			} else {
				return err
			}
		}
		if header {
			header = false
			continue
		}
		beanie := Beanie{
			Name:      r[0],
			Animal:    r[1],
			Family:    r[2],
			Thumbnail: r[3],
		}
		item, err := dynamodbattribute.MarshalMap(beanie)
		if err != nil {
			return err
		}

		_, err = dynamodb.New(sess).PutItem(&dynamodb.PutItemInput{
			Item:      item,
			TableName: aws.String("beanieboos"),
		})
		if err != nil {
			return err
		}

	}
	return nil
}
