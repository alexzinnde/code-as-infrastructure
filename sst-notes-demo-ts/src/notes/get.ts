import handler from '../util/handler'
import dynamoDb from '../util/dynamodb'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { GetItemInput, GetItemOutput } from 'aws-sdk/clients/dynamodb'

export const main = handler(async (event: APIGatewayProxyEventV2): Promise<GetItemOutput | Error> => {
  console.log('in get.main')
  // console.log(JSON.stringify(event, null, 2))
  if (!event.pathParameters) {
    throw new Error('event.pathParameters missing!')
  }

  
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    Key: {
      userId: '123', // The id of the author
      noteId: event.pathParameters.id // The id of the note from the path
    }
  } as GetItemInput

  const result = await dynamoDb.get(params)
  if (!result.Item) {
    throw new Error('Item not found.')
  }

  // Return the retrieved item
  return result.Item
})
