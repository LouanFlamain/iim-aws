const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("📥 Reçu dans addList:", event.body);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  const body = JSON.parse(event.body || "{}");
  const { name, owner } = body;

  if (!name || !owner) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Champs 'name' et 'owner' requis" }),
    };
  }

  const item = {
    id: uuidv4(),
    owner,
    name,
    createdAt: new Date().toISOString(),
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: process.env.STORAGE_TODOLISTS_NAME,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Liste ajoutée", item }),
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
