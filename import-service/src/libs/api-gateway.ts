import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S extends {}> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S extends {}> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json",
};

export const successResponse = (response: unknown) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: defaultHeaders,
  };
};

export const error404Response = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    body: JSON.stringify(response),
    headers: defaultHeaders,
  };
};

export const error400Response = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    body: JSON.stringify(response),
    headers: defaultHeaders,
  };
};

export const serverErrorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    body: JSON.stringify(response),
    headers: defaultHeaders,
  };
};
