import { successResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { products } from "@mocks/products";

export const getProductsList = async () => {
  return await Promise.resolve(successResponse(products));
};

export const main = middyfy(getProductsList);
