import * as iam from '@aws-cdk/aws-iam'
import * as sst from '@serverless-stack/resources'

export interface AuthStackProps extends sst.StackProps {
  api: sst.Api
  bucket: sst.Bucket
}

export default class AuthStack extends sst.Stack {
  // Public reference to the auth instance
  public auth

  constructor(scope: sst.App, id: string, props: AuthStackProps) {
    super(scope, id, props)

    const { api, bucket } = props

    // Create a Cognito User Pool and Identity Pool
    this.auth = new sst.Auth(this, 'Auth', {
      cognito: {
        userPool: {
          // Users can login with their email and password
          signInAliases: { email: true }
        }
      }
    })

    this.auth.attachPermissionsForAuthUsers([
      // Allow access to the API
      api,
      // Policy granting access to a specific folder in the bucket
      new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.ALLOW,
        resources: [bucket.bucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*']
      })
    ])

    if (!this.auth.cognitoUserPool || !this.auth.cognitoUserPoolClient) {
      throw new Error('Auth Stack failed')
    }
    // Show the auth resources in the output
    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool.userPoolId,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient.userPoolClientId
    })
  }
}
