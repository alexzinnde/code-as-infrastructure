import {  APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

async function getPhotos(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    return {
        statusCode: 200,
        body: 'hello world from lambda'
    }
}

export { getPhotos }