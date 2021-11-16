import handler from '../util/handler'
import dynamoDb from '../util/dynamodb'
import { QueryInput, QueryOutput, ItemList } from 'aws-sdk/clients/dynamodb'

export const main = handler(async (): Promise<ItemList | undefined> => {
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    KeyConditionExpression: 'userId = :userId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ':userId': '123'
    }
  } as QueryInput

  const result: QueryOutput = await dynamoDb.query(params)

  // Return the matching list of items in response body
  return result.Items
})
