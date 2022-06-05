import * as sst from "@serverless-stack/resources"
import { ResourceStack } from "./ResourceStack";

export function NoteStack({ stack }) {

  const { 
    userPool,
    cognitoClient,
    noteTable 
  } = sst.use(ResourceStack);

  const apiNote = new sst.Api(stack, "note-stack", {
    authorizers: {
      pool: {
        type: "user_pool",
        userPool: { 
          id: userPool.userPoolId, 
          clientIds: [cognitoClient.userPoolClientId]
        }
      },
    },
    defaults: {
      authorizer: "pool",
    },

    routes: {

      "POST /": {
        function: {
          handler: "services/note/actions.createNote",
          environment: { 
            noteTableName: noteTable.tableName 
          }
        }
      },
      "GET /": {
        function: {
          handler: "services/note/actions.listNotes",
          environment: { 
            noteTableName: noteTable.tableName 
          }
        }
      },
      "GET /{id}": {
        function: {
          handler: "services/note/actions.retrieveNote",
          environment: { 
            noteTableName: noteTable.tableName 
          }
        }
      }
    },
  })
  
  apiNote.attachPermissions([
      "dynamodb:list",
      "dynamodb:UpdateItem",
      "dynamodb:PutItem",
      "dynamodb:Scan",
      "dynamodb:GetItem"
  ])

  stack.addOutputs({
    ApiEndpoint: apiNote.url
  })
}
