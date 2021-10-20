import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as Lambda from '@aws-cdk/aws-lambda-nodejs'
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3'
import { Runtime } from '@aws-cdk/aws-lambda'

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'my-simple-app-bucket', {
      encryption: BucketEncryption.S3_MANAGED
    })

    const lambda = new Lambda.NodejsFunction(this, 'get-photos-lambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '..', 'api', 'get-photos', 'index.ts'),
      handler: 'getPhotos'
    })

    new cdk.CfnOutput(this, 'my-simple-app-bucket-name-export', {
      value: bucket.bucketName,
      exportName: 'my-simple-app-bucket-name'
    })


  }
}
