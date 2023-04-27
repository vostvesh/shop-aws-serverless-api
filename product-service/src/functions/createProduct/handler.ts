import {
  error400Response,
  serverErrorResponse,
  successResponse,
} from "@libs/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import { Product, Stock } from "@functions/types";
import dotenv from "dotenv";
const dynamo = new AWS.DynamoDB.DocumentClient();
dotenv.config();

export const postProduct = async (product: Product, stock: Stock) => {
  return dynamo
    .transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: `${process.env.PRODUCT_TABLE_NAME}`,
            Item: product,
          },
        },
        {
          Put: { TableName: `${process.env.STOCKS_TABLE_NAME}`, Item: stock },
        },
      ],
    })
    .promise();
};

export const createProduct = async (event: APIGatewayEvent) => {
  console.log("createProduct event: ", event);
  try {
    if (!event.body) {
      return error400Response({ error: "Incorrect body data" });
    }
    const data = JSON.parse(event.body);
    if (
      !data.description ||
      !data.genre ||
      !data.image ||
      !data.price ||
      !data.release_date ||
      !data.title ||
      !data.count
    ) {
      return error400Response({ error: "Incorrect body data" });
    }
    const id = uuid();
    const product: Product = {
      id,
      description: data.description,
      genre: data.genre,
      image: data.image,
      price: data.price,
      release_date: data.release_date,
      title: data.title,
    };
    const stock: Stock = {
      product_id: id,
      count: data.count,
    };
    const productResult = await postProduct(product, stock);
    console.log("productResult: ", productResult);
    if (productResult) {
      return successResponse(data);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    return serverErrorResponse({ error });
  }
};

export const main = createProduct;
