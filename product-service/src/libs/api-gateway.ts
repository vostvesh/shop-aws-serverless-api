import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S extends {}> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S extends {}> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const successResponse = (response: unknown) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const errorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    body: JSON.stringify(response),
  };
};
