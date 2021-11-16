import * as sst from '@serverless-stack/resources'

export interface ApiStackProps extends sst.StackProps {
  table: sst.Table
}

export default class ApiStack extends sst.Stack {
  public api

  constructor(scope: sst.App, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const { table } = props
    this.api = new sst.Api(this, 'notes-api', {
      // these props will apply to all routes
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName
        }
      },
      routes: {
        'POST  /notes': 'src/create.main',
        'GET   /notes/{id}': 'src/notes/get.main',
        'GET   /notes': 'src/notes/list.main',
        'PUT   /notes/{id}': 'src/notes/update.main',
        'DELETE /notes/{id}': 'src/delete.main'
      }
    })

    // Allow the API to access the table
    this.api.attachPermissions([table])

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url
    })
  }
}
