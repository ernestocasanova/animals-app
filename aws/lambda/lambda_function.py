

"""
Details:
    * Pyhton 3.6
    * AWS Lambda functions
    * AWS S3 Bucket to load media files
    * AWS DynamoDB to storage data
    * AWS API Gateway 
This script allows to create 3 functions to use in Api Gateway, to GET data, create records and delete records with Image upload to S3. 
"""

### Get all items from DynamoDB
import boto3
from boto3.dynamodb.conditions import Key
import json

def lambda_handler(event, context):
    
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('animals')
    
    response = table.scan()
    
    return response['Items']

### Create new record in DynamoDB and upload file to S3 Bucket
import boto3, json, base64, os
from boto3.dynamodb.conditions import Key
s3 = boto3.client('s3')

def lambda_handler(event, context):
    id = event['id']
    name = event['name']
    file = event['file']
    filename = event['filename']
    image = file[file.find(",")+1:]
    dec = base64.b64decode(image + "===")
    s3.put_object(Bucket='{bucketname}', Key=F'media/{filename}', Body=dec)
    url = F'https://{bucketname}.s3.amazonaws.com/media/{filename}'
    
    animal = {
        'Id': id,
        'Name': name,
        'Url': url
    }
    
    dynamodb = boto3.resource('dynamodb')
    
    table = dynamodb.Table('animals')
    
    table.put_item(Item=animal)
    
    return {'statusCode': 200, 'body': json.dumps(animal)}

### Delete item from DynamoDB
import json, boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    
    table = dynamodb.Table('animals')
    
    response = table.delete_item(
        Key={
            'Id': event['id'],
        },
    )
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
