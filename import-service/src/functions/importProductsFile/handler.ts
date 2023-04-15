import {
  error404Response,
  serverErrorResponse,
  successResponse,
} from "@libs/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
import { S3 } from "aws-sdk";

const Bucket = `ash-uploaded`;

const importProductsFile = async (event: APIGatewayEvent) => {
  try {
    const s3 = new S3({
      region: "us-east-1",
      signatureVersion: "v4",
    });
    const name = event.queryStringParameters?.name || "default.csv";
    console.log(name);
    if (!name) {
      return error404Response({ message: "Path parameter [name] is required" });
    }
    const params = {
      Bucket,
      Key: `uploaded/${name}`,
      ContentType: "text/csv",
      Expires: 60,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    console.log(url);
    return successResponse({ url });
  } catch (error) {
    console.log(error);
    return serverErrorResponse({ message: `Something went wrong: ${error}` });
  }
};

export const main = importProductsFile;
