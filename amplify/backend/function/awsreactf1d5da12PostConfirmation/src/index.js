const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambda = new LambdaClient({});

exports.handler = async (event) => {
  console.log("🔥 PostConfirmation TRIGGERED");
  console.log("event:", JSON.stringify(event));

  const { userAttributes } = event.request || {};
  const { sub, email } = userAttributes || {};

  if (!sub || !email) {
    console.warn("❗ Missing sub or email");
    return event;
  }

  console.log("👉 Appel de insertUsers avec :", { sub, email });

  try {
    const response = await lambda.send(
      new InvokeCommand({
        FunctionName: "insertUsers-dev",
        Payload: Buffer.from(JSON.stringify({ sub, email })),
      })
    );

    console.log("✅ insertUsers called:", response);
  } catch (err) {
    console.error("❌ Failed to call insertUsers:", err);
  }

  return event;
};
