import { serverErrorResponse, successResponse } from "@libs/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
import { S3, SQS } from "aws-sdk";
import csv from "csv-parser";

const Bucket = `ash-uploaded`;

const importProductsFile = async (event: APIGatewayEvent) => {
  try {
    const s3 = new S3({
      region: "us-east-1",
      signatureVersion: "v4",
    });
    const sqs = new SQS({ region: "us-east-1" });

    const key = (event as any).Records[0].s3.object.key;

    const records: any[] = [];

    const params = {
      Bucket,
      Key: key,
    };

    const stream = s3.getObject(params).createReadStream().pipe(csv());

    for await (const data of stream) {
      records.push(data);
      await sqs
        .sendMessage({
          QueueUrl: `${process.env.SQS_URL}`,
          MessageBody: JSON.stringify(data),
        })
        .promise();
    }

    await s3
      .copyObject({
        Bucket,
        CopySource: encodeURIComponent(key),
        Key: encodeURIComponent(key).replace("uploaded/", "parsed/"),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket,
        Key: encodeURIComponent(key),
      })
      .promise();

    return successResponse({ message: "success" });
  } catch (error) {
    console.log(error);
    return serverErrorResponse({ message: `Something went wrong: ${error}` });
  }
};

export const main = importProductsFile;
