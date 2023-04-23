import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv";

import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

dotenv.config();

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-auto-swagger"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "dev",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*", "rds:*"],
            Resource: ["${ssm:PRODUCT_TABLE}", "${ssm:STOCKS_TABLE}"],
          },
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: {
              "Fn::GetAtt": ["CatalogItemsQueue", "Arn"],
            },
          },
          {
            Effect: "Allow",
            Action: "sns:*",
            Resource: { Ref: "CreateProductTopic" },
          },
        ],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCT_TABLE_NAME: `${process.env.PRODUCT_TABLE_NAME}`,
      STOCKS_TABLE_NAME: `${process.env.STOCKS_TABLE_NAME}`,
      SNS_ARN: { Ref: "CreateProductTopic" },
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalog-items-queue",
        },
      },
      CreateProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "create-product-topic",
        },
      },
      CreateProductTopicSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.SUBSCRIPTION_EMAIL,
          Protocol: "email",
          TopicArn: { Ref: "CreateProductTopic" },
          FilterPolicyScope: "MessageAttributes",
          FilterPolicy: {
            count: [{ numeric: ["<=", 5] }],
          },
        },
      },
      CreateProductTopicSubscription2: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.SUBSCRIPTION_EMAIL_2,
          Protocol: "email",
          TopicArn: { Ref: "CreateProductTopic" },
          FilterPolicyScope: "MessageAttributes",
          FilterPolicy: {
            count: [{ numeric: [">=", 5] }],
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    autoswagger: {
      title: "Product API",
      apiType: "http",
      generateSwaggerOnDeploy: true,
      typefiles: ["./src/functions/types/Product.ts"],
    },
  },
};

module.exports = serverlessConfiguration;
