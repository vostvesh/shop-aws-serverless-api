import { serverErrorResponse, successResponse } from "@libs/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
import { S3 } from "aws-sdk";
const csv = require("csv-parser");

const Bucket = `ash-uploaded`;

const importProductsFile = async (event: APIGatewayEvent) => {
  try {
    const s3 = new S3({
      region: "us-east-1",
      signatureVersion: "v4",
    });

    const key = (event as any).Records[0].s3.object.key;

    const records: any[] = [];

    const params = {
      Bucket,
      Key: key,
    };

    const stream = s3.getObject(params).createReadStream();

    stream.on("data", (cunk) => {
      console.log("STREAM CHUNK:", cunk);
    });

    const file = await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", function (data: any) {
          console.log("Data parsed: ", data);
          records.push(data);
        })
        .on("end", function () {
          resolve(records);
        })
        .on("error", function () {
          reject("csv parse process failed");
        });
    });

    console.log("File parsed: ", file);

    await s3
      .copyObject({
        Bucket,
        CopySource: encodeURIComponent(key),
        Key: encodeURIComponent(key).replace("uploaded/", "parsed/"),
      })
      .promise();

    await s3.deleteObject({
      Bucket,
      Key: encodeURIComponent(key),
    }).promise();

    return successResponse({ message: "success" });
  } catch (error) {
    console.log(error);
    return serverErrorResponse({ message: `Something went wrong: ${error}` });
  }
};

export const main = importProductsFile;
