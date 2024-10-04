import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { sendHttp } from "./utils";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));


export async function handler(event: APIGatewayProxyEvent) {
    if (!event.body) {
        return sendHttp(404, { error: true })
    }

    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.NOTES_TABLE_NAME ?? 'Notesjack-sst-api-ts-Notes',
        Item: {
            // The attributes of the item to be created
            userId: "123", // The id of the author
            noteId: uuid.v1(), // A unique uuid
            content: data.content, // Parsed from request body
            attachment: data.attachment, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    }
    try {
        await dynamoDb.send(new PutCommand(params));
        return sendHttp(200, params.Item)
    } catch (error) {
        if (error instanceof Error) {
            return sendHttp(500, { error: error.message })
        }
        return sendHttp(500, { error: String(error) })
    }
}