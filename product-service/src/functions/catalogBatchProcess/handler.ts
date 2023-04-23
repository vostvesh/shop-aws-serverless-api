import { serverErrorResponse, successResponse } from "@libs/api-gateway";
import { SQSEvent } from "aws-lambda";
import { SNS } from "aws-sdk";
import { postProduct } from "@functions/createProduct/handler";
import { Product, Stock } from "@functions/types";

export const catalogBatchProcess = async (event: SQSEvent) => {
  const sns = new SNS({ region: "us-east-1" });

  try {
    const messages = event.Records.map(({ body }) => JSON.parse(body));

    const productAndStocks = await Promise.all(
      messages.map((message: any) => {
        const product: Product = {
          description: message?.description,
          genre: message?.genre,
          id: message?.id,
          image: message?.image,
          price: message?.price,
          release_date: message?.release_date,
          title: message?.title,
        };
        const stock: Stock = {
          count: message?.count,
          product_id: message?.product_id,
        };

        return { product, stock };
      })
    );

    for await (let { product, stock } of productAndStocks) {
      await postProduct(product, stock);
      await sns
        .publish(
          {
            Subject: "AWS SNS: Product creation notification.",
            Message: `${product.title} created`,
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
              count: {
                DataType: "Number",
                StringValue: stock.count,
              },
            },
          },
          () => {
            console.log("Email sent with product: ", product);
          }
        )
        .promise();
    }

    return successResponse({ message: "success" });
  } catch (error) {
    console.error(error);
    return serverErrorResponse({ message: "error" });
  }
};

export const main = catalogBatchProcess;
