import awsSdk from "aws-sdk";
import { Product, Stock } from "@functions/types";
import { products } from "@mocks/products";
import { stocks } from "@mocks/stocks";
import { PutItemInput } from "aws-sdk/clients/dynamodb";
awsSdk.config.credentials = new awsSdk.SharedIniFileCredentials({
  profile: "sandx",
});
import dotnev from 'dotenv';
dotnev.config();

const db = new awsSdk.DynamoDB({ region: "us-east-1" });

const productsTableName = `${process.env.PRODUCT_TABLE_NAME}`;
const stocksTableName = `${process.env.STOCKS_TABLE_NAME}`;

type ProductKeys = keyof Product;
type StocksKeys = keyof Stock;

const productsDynamoDbKeys = {
  id: "S",
  title: "S",
  description: "S",
  price: "N",
  genre: "S",
  release_date: "S",
  image: "S",
};

const stocksDynamoDbKeys = {
  product_id: "S",
  count: "N",
};

const productsDbData: PutItemInput[] = products.map((product) => ({
  TableName: productsTableName,
  Item: Object.keys(product).reduce((prev, key) => {
    return {
      ...prev,
      [key]: {
        [productsDynamoDbKeys[key as ProductKeys]]: `${
          product[key as ProductKeys]
        }`,
      },
    };
  }, {}),
}));

const stocksData: PutItemInput[] = stocks.map((stock) => ({
  TableName: stocksTableName,
  Item: Object.keys(stock).reduce((prev, key) => {
    return {
      ...prev,
      [key]: {
        [stocksDynamoDbKeys[key as StocksKeys]]: `${stock[key as StocksKeys]}`,
      },
    };
  }, {}),
}));

const populate = (items: PutItemInput[]) => {
  items.forEach((item) =>
    db.putItem(item, (error, data) => {
      if (error) {
        console.error("Something went wrong:(", error);
      } else {
        console.log("Data population completed", data);
      }
    })
  );
};

populate(productsDbData);
populate(stocksData);
