import * as uuid from 'uuid'
import AWS from 'aws-sdk'
import { PutItemInput } from 'aws-sdk/clients/dynamodb'
import { APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const main = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  if (!event.body)
    return {
      statusCode: 400,
      body: 'event MUST contain Body!'
    } as APIGatewayProxyResultV2

  const data = JSON.parse(event.body)

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // The attributes of the item to be created
      // BEFORE AUTH: userId: '123', // The id of the author
      userId: event.requestContext.authorizer?.iam?.cognitoIdentity.identityId, // The id of the author
      noteId: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now() // Current Unix timestamp
    }
  } as PutItemInput

  try {
    await dynamoDb.put(params).promise()

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    } as APIGatewayProxyResultV2
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    } as APIGatewayProxyResultV2
  }
}
