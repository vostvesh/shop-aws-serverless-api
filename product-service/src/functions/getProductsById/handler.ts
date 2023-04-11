import {
  error404Response,
  serverErrorResponse,
  successResponse,
} from "@libs/api-gateway";
// import { middyfy } from "@libs/lambda";
import { APIGatewayEvent } from "aws-lambda";
import AWS from "aws-sdk";
const dynamo = new AWS.DynamoDB.DocumentClient();

const scanProductById = async (id: string) => {
  return await dynamo
    .query({
      TableName: `${process.env.PRODUCT_TABLE_NAME}`,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id },
    })
    .promise();
};

export const getProductsById = async (event: APIGatewayEvent) => {
  console.log("getProductsById event: ", event);
  try {
    const id = event?.pathParameters?.productId;
    if (id) {
      const product = await scanProductById(id);
      if (product) {
        return successResponse(product);
      } else {
        return error404Response({ error: "Product not found" });
      }
    } else {
      return error404Response({
        error: "Query parameter productId is required",
      });
    }
  } catch (error) {
    return serverErrorResponse({ error });
  }
};

// export const main = middyfy(getProductsById);
export const main = getProductsById;
