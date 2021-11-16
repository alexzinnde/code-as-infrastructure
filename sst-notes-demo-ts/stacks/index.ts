import * as sst from '@serverless-stack/resources';
import StorageStack, { StorageStackProps } from './StorageStack';
import ApiStack, { ApiStackProps } from './ApiStack';

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x'
  });

  const { STAGE } = process.env;

  const storageStackProps = {
    STAGE,
    bucketName: 'az-sst-notes-attachments'
  } as StorageStackProps;
  const storage = new StorageStack(app, 'notes-storage', storageStackProps);

  const apiStackProps = {
    table: storage.table
  } as ApiStackProps;

  const api = new ApiStack(app, 'notes-api', apiStackProps);
}
