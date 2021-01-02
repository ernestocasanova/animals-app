

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
import boto3, json, base64
from boto3.dynamodb.conditions import Key
s3 = boto3.client('s3')

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    
    table = dynamodb.Table('animals')
    
    if event['context']['http-method'] == 'GET':
        
        response = table.scan()
        
        return response['Items']
        
    elif event['context']['http-method'] == 'POST':
        id = event['body-json']['id']
        name = event['body-json']['name']
        file = event['body-json']['file']
        filename = event['body-json']['filename']
        image = file[file.find(",")+1:]
        dec = base64.b64decode(image + "===")
        s3.put_object(Bucket='animals-s3bucket', Key=F'media/{filename}', Body=dec)
        url = F'https://animals-s3bucket.s3.amazonaws.com/media/{filename}'
        
        animal = {
            'Id': id,
            'Name': name,
            'Url': url
        }
        
        table.put_item(Item=animal)
        
        return {'statusCode': 200, 'headers': {
            "Access-Control-Allow-Origin" : "*",        # Required for CORS support to work
            "Access-Control-Allow-Credentials" : true   # Required for cookies, authorization headers with HTTPS 
          }, 'body': json.dumps(animal)}
    elif event['context']['http-method'] == 'DELETE':
        response = table.delete_item(
            Key={
                'Id': event['params']['querystring']['id'],
            },
        )
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin" : "*",        # Required for CORS support to work
                "Access-Control-Allow-Credentials" : true   # Required for cookies, authorization headers with HTTPS 
            },
            'body': json.dumps(response)
        } 
    else:
        return {'statusCode': 405, 'body': 'INVALID METHOD'}
