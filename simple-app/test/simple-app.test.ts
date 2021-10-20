import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as SimpleApp from '../lib/stacks/simple-app-stack'
import '@aws-cdk/assert/jest'

test('Simple App Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new SimpleApp.SimpleAppStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {
          mysimpleappbucket7D580FB3: {
            Type: 'AWS::S3::Bucket',
            Properties: {
              BucketEncryption: {
                ServerSideEncryptionConfiguration: [
                  {
                    ServerSideEncryptionByDefault: {
                      SSEAlgorithm: 'AES256'
                    }
                  }
                ]
              }
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
          }
        },
        Outputs: {
          mysimpleappbucketnameexport: {
            Value: {
              Ref: 'mysimpleappbucket7D580FB3'
            },
            Export: {
              Name: 'my-simple-app-bucket-name'
            }
          }
        }
      },
      MatchStyle.EXACT
    )
  )
})

test('Stack Create S3 Bucket', () => {
  // ARRANGE
  const app = new cdk.App()
  // ACT
  const stack = new SimpleApp.SimpleAppStack(app, 'MyTestStack')
  // ASSERT
  expect(stack).toHaveResource('AWS::S3::Bucket')
})
