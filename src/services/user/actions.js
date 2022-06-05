import { 
  CognitoIdentityProviderClient, 
  ListUsersCommand,
  AdminGetUserCommand,
  AdminCreateUserCommand 
} from "@aws-sdk/client-cognito-identity-provider";


export const listUsers = async (event) => {

    const user = event.requestContext.authorizer.jwt.claims

    const cognitoClient = new CognitoIdentityProviderClient({region: process.env.REGION})

    const listUsersCommand = new ListUsersCommand({
      UserPoolId: process.env.UserPoolId
    })

    const users = await cognitoClient.send(listUsersCommand)

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        users: users
      },
    };
};

export const retrieveUser = async (event) => {

  const { id } = event.pathParameters

  const cognitoClient = new CognitoIdentityProviderClient({region: process.env.REGION})
  const adminGetUserCommand = new AdminGetUserCommand({
    UserPoolId: process.env.UserPoolId,
    Username: id
  })

  const user = await cognitoClient.send(adminGetUserCommand)

  return {
    statusCode: 200,
    body:{
      user: user
    },
  };
};

export const createUser = async (event) => {

  const { email } = JSON.parse(event.body)

  const cognitoClient = new CognitoIdentityProviderClient({region: process.env.REGION})
  const adminCreateUserCommand = new AdminCreateUserCommand({
    UserPoolId: process.env.UserPoolId,
    Username: email,
  })

  await cognitoClient.send(adminCreateUserCommand)

  return {
    statusCode: 200,
    body: `${email} registered successfully.`
  }
};
  