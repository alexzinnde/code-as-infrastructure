import handler from '../util/handler'
import dynamoDb from '../util/dynamodb'
import { DeleteItemInput } from 'aws-sdk/clients/dynamodb'
import { APIGatewayProxyEventV2 } from 'aws-lambda'

export const main = handler(async (event: APIGatewayProxyEventV2): Promise<{ status: true }> => {
  if (!event.pathParameters) {
    throw new Error('Event must contain path parameter id')
  }
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be removed
    Key: {
      userId: '123', // The id of the author
      noteId: event.pathParameters.id // The id of the note from the path
    }
  } as DeleteItemInput

  await dynamoDb.delete(params)

  return { status: true }
})
