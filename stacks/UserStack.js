import * as sst from "@serverless-stack/resources"
import { ResourceStack } from "./ResourceStack";

export function UserStack({ stack }) {

  const { 
    userPool,
    cognitoClient,
    noteTable 
  } = sst.use(ResourceStack);

  const apiUser = new sst.Api(stack, "user-stack", {
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
          handler: "services/user/actions.createUser",
          environment: { 
            UserPoolId: userPool.userPoolId
          }
        }
      },
      "GET /": {
        function: {
          handler: "services/user/actions.listUsers",
          environment: { 
            UserPoolId: userPool.userPoolId
          }
        }
      },
      "GET /{id}": {
        function: {
          handler: "services/user/actions.retrieveUser",
          environment: { 
            UserPoolId: userPool.userPoolId
          }
        }
      }
    },
  })
  

  apiUser.attachPermissions([
    "cognito-idp:ListUsers",
    "cognito-idp:AdminGetUser",
    "cognito-idp:AdminCreateUser"
  ])
  stack.addOutputs({
    ApiEndpoint: apiUser.url
  })
}
