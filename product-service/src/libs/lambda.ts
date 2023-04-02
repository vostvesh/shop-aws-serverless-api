import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEvent } from "aws-lambda";

export const middyfy = (
  handler: (event: APIGatewayProxyEvent) => Promise<{
    statusCode: number;
    body: string;
  }>
) => {
  return middy(handler).use(middyJsonBodyParser());
};
