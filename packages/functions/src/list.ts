import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { sendHttp } from "./utils";

const dynamodb = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = {
      TableName: process.env.NOTES_TABLE_NAME ?? 'Notesjack-sst-api-ts-Notes',
    };

    const data = await dynamodb.scan(params).promise();

    return sendHttp(200, data.Items ?? []);
  } catch (err) {
    console.log(err);
    return sendHttp(500, { message: "Failed to get notes" });
  }
}