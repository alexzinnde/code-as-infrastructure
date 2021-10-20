import * as cdk from '@aws-cdk/core'
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3'

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'my-simple-app-bucket', {
      encryption: BucketEncryption.S3_MANAGED
    })

    new cdk.CfnOutput(this, 'my-simple-app-bucket-name-export', {
      value: bucket.bucketName,
      exportName: 'my-simple-app-bucket-name'
    })
  }
}
