const generatePolicy = (principalId: any, resource: any, effect = "Allow") => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

const basicAuthorizer = async (event: any, ctx: any, cb: any) => {
  console.log("Event: ", JSON.stringify(event));

  if (event["type"] !== "TOKEN") {
    cb("Unauthorized");
  }

  try {
    const authToken = event.authorizationToken;
    const encodedCreds = authToken.split(" ")[1];
    const buff = Buffer.from(authToken, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log("username: ", username);
    console.log("password: ", password);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (error) {
    cb("Unauthorized: ", error);
  }
};

export const main = basicAuthorizer;
