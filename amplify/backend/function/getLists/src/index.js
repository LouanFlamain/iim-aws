const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("📥 Reçu dans getLists:", JSON.stringify(event));

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  const userSub = event.queryStringParameters?.sub;

  if (!userSub) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Utilisateur non authentifié" }),
    };
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: process.env.STORAGE_TODOLISTS_NAME,
        IndexName: "owner-index",
        KeyConditionExpression: "#owner = :owner",
        ExpressionAttributeNames: {
          "#owner": "owner",
        },
        ExpressionAttributeValues: {
          ":owner": userSub,
        },
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("❌ Erreur de lecture :", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erreur serveur" }),
    };
  }
};
