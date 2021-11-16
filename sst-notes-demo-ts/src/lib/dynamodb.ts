import { DynamoDB } from 'aws-sdk'
import {
  DeleteItemInput,
  DeleteItemOutput,
  GetItemInput,
  GetItemOutput,
  PutItemInput,
  PutItemOutput,
  QueryInput,
  QueryOutput,
  UpdateItemInput,
  UpdateItemOutput
} from 'aws-sdk/clients/dynamodb'

const client = new DynamoDB.DocumentClient()

export default {
  get: (params: GetItemInput): Promise<GetItemOutput> => client.get(params).promise(),
  put: (params: PutItemInput): Promise<PutItemOutput> => client.put(params).promise(),
  query: (params: QueryInput): Promise<QueryOutput> => client.query(params).promise(),
  update: (params: UpdateItemInput): Promise<UpdateItemOutput> => client.update(params).promise(),
  delete: (params: DeleteItemInput): Promise<DeleteItemOutput> => client.delete(params).promise()
}
