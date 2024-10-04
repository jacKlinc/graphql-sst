import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { sendHttp } from "./utils";

const dynamodb = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.pathParameters || !event.pathParameters.userId || !event.pathParameters.noteId) {
        return sendHttp(400, { message: "Missing path parameters" }) 
    }
    const userId = event.pathParameters.userId;
    const noteId = event.pathParameters.noteId;
    const params = {
        TableName: process.env.NOTES_TABLE_NAME ?? 'Notesjack-sst-api-ts-Notes',
        KeyConditionExpression: "userId = :userId and noteId = :noteId",
        ExpressionAttributeValues: {
            ":userId": userId,
            ":noteId": noteId,
        },
    };

    const data = await dynamodb.query(params).promise();

    if (!data.Items || data.Items.length === 0) {
        return sendHttp(404, { message: "Note not found" }) 
    }
    return sendHttp(200, data.Items[0]); 
}