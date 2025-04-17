/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TODOVALUE_ARN
	STORAGE_TODOVALUE_NAME
	STORAGE_TODOVALUE_STREAMARN
Amplify Params - DO NOT EDIT */const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("📥 Reçu dans getTodoValues:", JSON.stringify(event));

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };

  // 🔁 Gérer les requêtes préflight OPTIONS
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

  const todoId = event.queryStringParameters?.todoId;

  if (!todoId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Paramètre 'todoId' requis" }),
    };
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: process.env.STORAGE_TODOVALUE_NAME,
        IndexName: "todoId-index", // ✅ obligatoire si GSI
        KeyConditionExpression: "#todoId = :todoId",
        ExpressionAttributeNames: {
          "#todoId": "todoId",
        },
        ExpressionAttributeValues: {
          ":todoId": todoId,
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
