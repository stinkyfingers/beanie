package main

import (
	"bytes"
	"context"
	"flag"
	"fmt"
	"log"
	"reflect"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

const (
	region      = "us-west-1"
	source      = "beanieboos"
	destination = "beanies"
	limit       = 10
)

type Event struct {
	Name string `json:"name"`
}

type Beanie struct {
	Name        string `json:"name"`
	Family      string `json:"family"`
	Animal      string `json:"animal"`
	Birthday    string `json:"birthday"`
	ExclusiveTo string `json:"exclusiveTo"`
	Height      string `json:"height"`
	Image       string `json:"image,omitempty"`
	IntroDate   string `json:"introDate"`
	Length      string `json:"length"`
	Number      string `json:"number"`
	RetireDate  string `json:"retireDate"`
	ST          string `json:"st"`
	Thumbnail   string `json:"thumbnail"`
	TT          string `json:"tt"`
	Variety     string `json:"variety"`
}

var live = flag.Bool("live", false, "local db")

func main() {
	flag.Parse()
	// lambda.Start(HandleRequest)
	err := HandleRequest(context.Background(), Event{})
	if err != nil {
		log.Fatal(err)
	}

}

func HandleRequest(ctx context.Context, event Event) error {
	fmt.Println(event)
	client, uploader, err := newClient()
	if err != nil {
		return err
	}
	// var startKey map[string]*dynamodb.AttributeValue
	// for {
	// 	lastKey, err := family(client, s3uploader, "Beanie Boos", startKey)
	// 	if err != nil {
	// 		fmt.Println("family error: ", err, "last ", lastKey)
	// 	}
	// 	if lastKey == nil {
	// 		break
	// 	}
	// 	startKey = lastKey
	// }
	// fmt.Println("DONE")
	// return nil

	// completed
	names, err := getKeys(client, destination)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(names)

	// source
	allNames, err := getKeysByFamily(client, source, "Beanie Babies")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(allNames)

	var todos []map[string]*dynamodb.AttributeValue
	for _, n := range allNames {
		var found bool
		for _, name := range names {
			if reflect.DeepEqual(name, n) {
				found = true
				break
			}
		}
		if !found {
			todos = append(todos, n)
		}
	}
	log.Print("TODOS", todos)
	for _, todo := range todos {
		err = moveToNewTable(client, uploader, todo)
		if err != nil {
			log.Fatal(err)
		}
	}
	return nil
}

func getKeys(client *dynamodb.DynamoDB, table string) ([]map[string]*dynamodb.AttributeValue, error) {
	var names []map[string]*dynamodb.AttributeValue
	input := &dynamodb.ScanInput{
		TableName:       aws.String(table),
		AttributesToGet: []*string{aws.String("name")},
	}
	resp, err := client.Scan(input)
	if err != nil {
		fmt.Println("scan err")
		return nil, err
	}
	for _, item := range resp.Items {
		names = append(names, item)
	}
	return names, nil
}

func getKeysByFamily(client *dynamodb.DynamoDB, table, family string) ([]map[string]*dynamodb.AttributeValue, error) {
	var names []map[string]*dynamodb.AttributeValue
	input := &dynamodb.QueryInput{
		TableName: aws.String(table),
		IndexName: aws.String("family"),
		ExpressionAttributeNames: map[string]*string{
			"#name":   aws.String("name"),
			"#family": aws.String("family"),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":family": {
				S: aws.String(family),
			},
		},
		KeyConditionExpression: aws.String("#family = :family"),
		ProjectionExpression:   aws.String("#name"),
	}
	resp, err := client.Query(input)
	if err != nil {
		fmt.Println("query err")
		return nil, err
	}
	for _, item := range resp.Items {
		names = append(names, item)
	}
	return names, nil
}

func moveToNewTable(client *dynamodb.DynamoDB, uploader *s3manager.Uploader, key map[string]*dynamodb.AttributeValue) error {
	input := &dynamodb.GetItemInput{
		TableName: aws.String(source),
		Key:       key,
	}
	resp, err := client.GetItem(input)
	if err != nil {
		return err
	}

	var beanie Beanie
	err = dynamodbattribute.UnmarshalMap(resp.Item, &beanie)
	if err != nil {
		return err
	}
	if beanie.Family == "" {
		return nil
	}
	fmt.Println("BEANIE:", beanie.Name, beanie.Family)

	if *live {
		// Upload the file to S3
		body := bytes.NewReader([]byte(beanie.Image))
		_, err = uploader.Upload(&s3manager.UploadInput{
			Bucket: aws.String("beaniedata.john-shenk.com"),
			Key:    aws.String(fmt.Sprintf("%s.%s", beanie.Name, beanie.Family)),
			Body:   body,
		})
		if err != nil {
			fmt.Println("S3 error")
			return err
		}
	}

	beanie.Image = ""
	imagelessItem, err := dynamodbattribute.MarshalMap(beanie)
	if err != nil {
		return err
	}

	_, err = client.PutItem(&dynamodb.PutItemInput{
		Item:      imagelessItem,
		TableName: aws.String(destination),
	})
	if err != nil {
		fmt.Println("Put error")
		return err
	}
	return nil
}

// func family(client *dynamodb.DynamoDB, uploader *s3manager.Uploader, name string, startKey map[string]*dynamodb.AttributeValue) (map[string]*dynamodb.AttributeValue, error) {
// 	input := &dynamodb.ScanInput{
// 		TableName: aws.String(source),
// 		Limit:     aws.Int64(limit),
// 	}
// 	if startKey != nil {
// 		input.ExclusiveStartKey = startKey
// 	}
//
// 	resp, err := client.Scan(input)
// 	if err != nil {
// 		fmt.Println("scan err")
// 		return nil, err
// 	}
// 	fmt.Println("last key ", resp.LastEvaluatedKey)
//
// 	var req []*dynamodb.WriteRequest
// 	for _, item := range resp.Items {
// 		var beanie Beanie
// 		err = dynamodbattribute.UnmarshalMap(item, &beanie)
// 		if err != nil {
// 			return nil, err
// 		}
// 		if beanie.Family == "" {
// 			continue
// 		}
// 		fmt.Println(beanie.Name, beanie.Family)
//
// 		// Upload the file to S3
// 		body := bytes.NewReader([]byte(beanie.Image))
// 		_, err = uploader.Upload(&s3manager.UploadInput{
// 			Bucket: aws.String("beaniedata.john-shenk.com"),
// 			Key:    aws.String(fmt.Sprintf("%s.%s", beanie.Name, beanie.Family)),
// 			Body:   body,
// 		})
// 		if err != nil {
// 			return nil, err
// 		}
//
// 		beanie.Image = ""
// 		imagelessItem, err := dynamodbattribute.MarshalMap(beanie)
// 		if err != nil {
// 			return nil, err
// 		}
//
// 		req = append(req, &dynamodb.WriteRequest{
// 			PutRequest: &dynamodb.PutRequest{
// 				Item: imagelessItem,
// 			},
// 		})
// 	}
// 	_, err = client.BatchWriteItem(&dynamodb.BatchWriteItemInput{RequestItems: map[string][]*dynamodb.WriteRequest{"beanies": req}})
// 	if err != nil {
// 		fmt.Println("write err")
// 		return nil, err
// 	}
//
// 	return resp.LastEvaluatedKey, nil // TODO - next page
// }

func newClient() (*dynamodb.DynamoDB, *s3manager.Uploader, error) {
	options := session.Options{}

	if *live {
		options.Profile = "jds"
	}

	sess, err := session.NewSessionWithOptions(options)
	if err != nil {
		return nil, nil, err
	}
	if !*live {
		sess.Config.Endpoint = aws.String("http://localhost:8000")
	}
	sess.Config.WithRegion(region)

	return dynamodb.New(sess), s3manager.NewUploader(sess), nil
}
