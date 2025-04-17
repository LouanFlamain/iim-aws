/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TODOVALUE_ARN
	STORAGE_TODOVALUE_NAME
	STORAGE_TODOVALUE_STREAMARN
Amplify Params - DO NOT EDIT */
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("📥 Reçu dans addTodoValue :", event.body);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS", // ✅ à ajouter ici aussi
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  const body = JSON.parse(event.body || "{}");
  const { todoId, value } = body;

  if (!todoId || !value) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Champs 'todoId' et 'value' requis" }),
    };
  }

  const item = {
    id: crypto.randomUUID(),
    todoId,
    value,
    createdAt: new Date().toISOString(),
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: process.env.STORAGE_TODOVALUE_NAME,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Value ajoutée", item }),
    };
  } catch (err) {
    console.error("❌ Erreur ajout :", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erreur serveur" }),
    };
  }
};
