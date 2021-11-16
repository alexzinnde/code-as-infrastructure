import * as sst from '@serverless-stack/resources'
import StorageStack, { StorageStackProps } from './StorageStack'
import ApiStack, { ApiStackProps } from './ApiStack'
import AuthStack from './AuthStack'
import FrontEndStack from './FrontEndStack'

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x'
  })

  const { STAGE } = process.env

  const storageStackProps = {
    STAGE,
    bucketName: 'az-sst-notes-attachments'
  } as StorageStackProps
  const storageStack = new StorageStack(app, 'notes-storage', storageStackProps)

  const apiStackProps = {
    table: storageStack.table
  } as ApiStackProps

  const apiStack = new ApiStack(app, 'notes-api', apiStackProps)

  const authStack = new AuthStack(app, 'notes-auth', {
    api: apiStack.api,
    bucket: storageStack.bucket
  })

  new FrontEndStack(app, 'frontend', {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket
  })
}
