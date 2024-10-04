import { Api, StackContext, Stack, Table } from "sst/constructs";


export function ExampleStack({ app, stack }: StackContext) {
  // create the http api
  const httpApi = new Api(stack, "api", {
    routes: {
      "get /list": "packages/functions/src/list.handler",
      "get /read": "packages/functions/src/get.handler",
      "post /create": "packages/functions/src/create.handler",
    },
  });

  // create a DynamoDB table
  const notesTable = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
  });
  
  // show the api endpoint in the output
  stack.addOutputs({
    apiendpoint: httpApi.url,
    tableName: notesTable.tableName,
    notesTableName: notesTable.tableName,
  });
}
