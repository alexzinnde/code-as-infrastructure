import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as Lambda from '@aws-cdk/aws-lambda-nodejs'
import * as CloudFront from '@aws-cdk/aws-cloudfront'
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2'
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations'
import { Runtime } from '@aws-cdk/aws-lambda'
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront'

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'MySimpleAppBucket', {
      encryption: BucketEncryption.S3_MANAGED
    })

    new BucketDeployment(this, 'publicBucket', {
      sources: [Source.asset(path.join(__dirname, '..', 'assets', 'photos'))],
      destinationBucket: bucket
    })

    const websiteBucket = new Bucket(this, 'MySimpleAppWebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    })

    new BucketDeployment(this, 'MySimpleAppFrontEndBucketDeployment', {
      sources: [Source.asset(path.join(__dirname, '..', '..', 'frontend', 'build'))],
      destinationBucket: websiteBucket
    })

    const getPhotos = new Lambda.NodejsFunction(this, 'GetPhotosLambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '..', '..', 'api', 'get-photos', 'index.ts'),
      handler: 'getPhotos',
      environment: {
        PHOTO_BUCKET_NAME: bucket.bucketName
      }
    })

    bucket.grantReadWrite(getPhotos)

    // IAM Policies
    // const bucketContainerPermissions = new PolicyStatement()
    // bucketContainerPermissions.addResources(bucket.bucketArn)
    // bucketContainerPermissions.addActions('s3:ListBucket')

    // const bucketPermissions = new PolicyStatement()
    // bucketPermissions.addResources(`${bucket.bucketArn}/*`)
    // bucketPermissions.addActions('s3:getObject', 's3:putObject')

    // getPhotos.addToRolePolicy(bucketContainerPermissions)
    // getPhotos.addToRolePolicy(bucketPermissions)

    const httpApi = new HttpApi(this, 'simple-app-http-api', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.GET]
      },
      apiName: 'photo-api',
      createDefaultStage: true
    })

    const lambdaIntegration = new LambdaProxyIntegration({
      handler: getPhotos
    })

    httpApi.addRoutes({
      path: '/getAllPhotos',
      methods: [HttpMethod.GET],
      integration: lambdaIntegration
    })

    const cloudFront = new CloudFrontWebDistribution(this, 'MySimpleAppCloudFrontWebDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    })

    new cdk.CfnOutput(this, 'my-simple-app-bucket-name-export', {
      value: bucket.bucketName,
      exportName: 'my-simple-app-bucket-name'
    })

    new cdk.CfnOutput(this, 'MySimpleAppApi', {
      value: httpApi.url!,
      exportName: 'MySimpleAppApiEndpoint'
    })

    new cdk.CfnOutput(this, 'MySimpleAppWebsiteUrl', {
      value: cloudFront.distributionDomainName,
      exportName: 'MySimpleAppUrl'
    })
  }
}
