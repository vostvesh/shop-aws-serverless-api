import { Product, Stock } from "@functions/types";
import { successResponse } from "@libs/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
// import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
const dynamo = new AWS.DynamoDB.DocumentClient();

const scanProducts = async () => {
  return await dynamo
    .scan({
      TableName: `${process.env.PRODUCT_TABLE_NAME}`,
    })
    .promise();
};

const scanStocks = async () => {
  return await dynamo
    .scan({
      TableName: `${process.env.STOCKS_TABLE_NAME}`,
    })
    .promise();
};

export const getProductsList = async (event: APIGatewayEvent) => {
  console.log("getProductsById event: ", event);
  const stocks = (await scanStocks()).Items as Stock[];
  const products = (await scanProducts()).Items as Product[];
  return await Promise.resolve(
    successResponse(
      products.map((product: Product) => ({
        ...product,
        count: stocks.find((stock) => stock.product_id === product.id)?.count,
      }))
    )
  );
};

// TODO: unexpected error from middyfy
// export const main = middyfy(getProductsList);
export const main = getProductsList;
