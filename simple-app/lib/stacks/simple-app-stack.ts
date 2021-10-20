import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as Lambda from '@aws-cdk/aws-lambda-nodejs'
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'

import { Runtime } from '@aws-cdk/aws-lambda'
import { PolicyStatement } from '@aws-cdk/aws-iam'

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'my-simple-app-bucket', {
      encryption: BucketEncryption.S3_MANAGED
    })

    new BucketDeployment(this, 'public-bucket', {
      sources: [Source.asset(path.join(__dirname, '..', 'assets', 'photos'))],
      destinationBucket: bucket
    })

    const getPhotos = new Lambda.NodejsFunction(this, 'get-photos-lambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '..', 'api', 'get-photos', 'index.ts'),
      handler: 'getPhotos',
      environment: {
        PHOTO_BUCKET_NAME: bucket.bucketName
      }
    })

    // bucket.grantRead(lambda)

    // IAM Policies
    const bucketContainerPermissions = new PolicyStatement()
    bucketContainerPermissions.addResources(bucket.bucketArn)
    bucketContainerPermissions.addActions('s3:ListBucket')

    const bucketPermissions = new PolicyStatement()
    bucketPermissions.addResources(`${bucket.bucketArn}/*`)
    bucketPermissions.addActions('s3:getObject', 's3:putObject')

    getPhotos.addToRolePolicy(bucketContainerPermissions)
    getPhotos.addToRolePolicy(bucketPermissions)


    new cdk.CfnOutput(this, 'my-simple-app-bucket-name-export', {
      value: bucket.bucketName,
      exportName: 'my-simple-app-bucket-name'
    })
  }
}
