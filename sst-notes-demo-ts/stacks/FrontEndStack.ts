/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as sst from '@serverless-stack/resources'

export interface FrontEndStackProps extends sst.StackProps {
  api: sst.Api
  auth: sst.Auth
  bucket: sst.Bucket
}

export default class FrontendStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: FrontEndStackProps) {
    super(scope, id, props)

    const { api, auth, bucket } = props

    // Define our React app
    const site = new sst.ReactStaticSite(this, 'ReactSite', {
      path: 'frontend',
      // Pass in our environment variables
      environment: {
        REACT_APP_API_URL: api.url,
        REACT_APP_REGION: scope.region,
        REACT_APP_BUCKET: bucket.bucketName,
        REACT_APP_USER_POOL_ID: auth.cognitoUserPool!.userPoolId,
        REACT_APP_IDENTITY_POOL_ID: auth.cognitoCfnIdentityPool.ref,
        REACT_APP_USER_POOL_CLIENT_ID: auth.cognitoUserPoolClient!.userPoolClientId
      }
    })

    // Show the url in the output
    this.addOutputs({
      SiteUrl: site.url
    })
  }
}
