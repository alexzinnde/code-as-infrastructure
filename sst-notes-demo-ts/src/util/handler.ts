/* eslint-disable @typescript-eslint/no-empty-function */
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda'

export default function handler(lambda: Handler) {
  return async function (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    let body, statusCode

    try {
      // run the lambda
      body = await lambda(event, context, () => {})
      statusCode = 200
    } catch (err) {
      console.error(err)
      body = { error: 'something went wrong' }
      statusCode = 500
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    } as APIGatewayProxyResultV2
  }
}
