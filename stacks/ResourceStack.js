import * as sst from "@serverless-stack/resources"
import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as cognito from 'aws-cdk-lib/aws-cognito'

export function ResourceStack({ stack }) {


  const userPool = new cognito.UserPool(stack, 'userpool', {
    userPoolName: `${stack.stage}-cognito-user-pool`,
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
    },
    autoVerify: {
      email: true,
    },
    standardAttributes: {
      givenName: {
        required: true,
        mutable: true,
      },
      familyName: {
        required: true,
        mutable: true,
      },
    },
    customAttributes: {
      country: new cognito.StringAttribute({mutable: true}),
      city: new cognito.StringAttribute({mutable: true}),
      isAdmin: new cognito.StringAttribute({mutable: true}),
    },
    passwordPolicy: {
      minLength: 6,
      requireLowercase: false,
      requireDigits: false,
      requireUppercase: false,
      requireSymbols: false,
    },
    accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const standardCognitoAttributes = {
    givenName: true,
    familyName: true,
    email: true,
    emailVerified: true,
    address: true,
    birthdate: true,
    gender: true,
    locale: true,
    middleName: true,
    fullname: true,
    nickname: true,
    phoneNumber: true,
    phoneNumberVerified: true,
    profilePicture: true,
    preferredUsername: true,
    profilePage: true,
    timezone: true,
    lastUpdateTime: true,
    website: true,
  };

  const clientReadAttributes = new cognito.ClientAttributes()
  .withStandardAttributes(standardCognitoAttributes)
  .withCustomAttributes(...['country', 'city', 'isAdmin']);

  const clientWriteAttributes = new cognito.ClientAttributes()
  .withStandardAttributes({
    ...standardCognitoAttributes,
    emailVerified: false,
    phoneNumberVerified: false,
  })
  .withCustomAttributes(...['country', 'city']);

  const cognitoClient = userPool.addClient('app-client', {
    
    supportedIdentityProviders: [
      cognito.UserPoolClientIdentityProvider.COGNITO,
    ],
    authFlows: {
      adminUserPassword: true,
      userPassword: true,
      custom: false,
      userSrp: false,
    },
    
    writeAttributes: clientWriteAttributes,
    readAttributes: clientReadAttributes
  });


    /* Dynamodb Table created by SST 
    const pdfTable = new sst.Table(stack, `${stack.stage}-ddb-pdf-table`, {
        fields: {
          name: "string",
          path: "string",
        },
        primaryIndex: { partitionKey: "name" },
    });
    */

    /*  Dynamodb Table created by AWS CDK */ 
    const noteTable = new dynamodb.Table(stack, `${stack.stage}-ddb-note-table`, {
        partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
        sortKey: {name: 'createdAt', type: dynamodb.AttributeType.NUMBER},
        billingMode: dynamodb.BillingMode.PROVISIONED,
        readCapacity: 1,
        writeCapacity: 1,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

    

      return {
        userPool,
        cognitoClient,
        noteTable
      };
}
