import { errorResponse, successResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { products } from "@mocks/products";
import { APIGatewayEvent } from "aws-lambda";

export const getProductsById = async (event: APIGatewayEvent) => {
  const product = products.find(
    (product) => product.id === event?.pathParameters?.productId
  );
  if (product) {
    return successResponse(product);
  } else {
    return errorResponse({ error: "Product not found" });
  }
};

export const main = middyfy(getProductsById);
