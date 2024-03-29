import * as sst from '@serverless-stack/resources'
import { HttpMethods } from '@aws-cdk/aws-s3'

export interface StorageStackProps extends sst.StackProps {
  STAGE: string
  bucketName: string
}
export default class StorageStack extends sst.Stack {
  public table
  public bucket

  constructor(scope: sst.App, id: string, props: StorageStackProps) {
    super(scope, id, props)

    // DynamoDB Table
    this.table = new sst.Table(this, 'notes', {
      dynamodbTable: {
        tableName: 'az-sst-notes-table'
      },
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING
      },
      primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' }
    })

    this.bucket = new sst.Bucket(this, 'uploads', {
      s3Bucket: {
        bucketName: props.bucketName,
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ['*'],
            allowedHeaders: ['*'],
            allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE, HttpMethods.HEAD]
          }
        ]
      }
    })
  }
}
