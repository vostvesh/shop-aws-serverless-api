import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";

export const event: APIGatewayProxyEvent = {
  version: "",
  routeKey: "",
  rawPath: "",
  rawQueryString: "",
  cookies: [],
  headers: {},
  queryStringParameters: {},
  requestContext: {},
  body: "",
  pathParameters: {},
  isBase64Encoded: true,
  stageVariables: {},
} as any;
