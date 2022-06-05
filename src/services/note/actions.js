import { 
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  GetItemCommand 
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';


export const createNote = async (event) => {

    const { note_name, description } = JSON.parse(event.body)
    const user = event.requestContext.authorizer.jwt.claims

    const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION })

    const params = {
      TableName: process.env.noteTableName,
      Item: {
        id: { S: uuidv4() },
        createdAt: {  N: `${Date.now() / 1000}`},
        name: { S: note_name },
        description: { S: description },
        user: { S: user.sub },
      }
    };

    await dynamoDBClient.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      body: `${note_name} registered successfully!`,
    };
};

export const listNotes = async (event) => {

  const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION })
  const scanCommand = new ScanCommand({
    TableName: process.env.noteTableName
  })
   
  const notes = await dynamoDBClient.send(scanCommand)

  return {
    statusCode: 200,
    body:{
      notes: notes
    }
  };
};

export const retrieveNote = async (event) => {

  const { id } = event.pathParameters
  
  const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION })
  const getItemCommand = new GetItemCommand({
    TableName: process.env.noteTableName,
    Key: {
      id: { S: `${id}` }
    }
  })
   
  const note = await dynamoDBClient.send(getItemCommand)

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: {
      note: note
    },
  };
};
  