const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("📥 insertUsers reçu :", JSON.stringify(event));

  const { sub, email } = event;

  if (!sub || !email) {
    console.warn("❗ sub ou email manquant");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "sub ou email manquant" }),
    };
  }

  const userItem = {
    sub,
    email,
    createdAt: new Date().toISOString(),
  };

  try {
    console.log("📦 Table :", process.env.STORAGE_USERS_NAME);

    await ddb.send(
      new PutCommand({
        TableName: process.env.STORAGE_USERS_NAME,
        Item: userItem,
      })
    );

    console.log("✅ User ajouté à DynamoDB :", userItem);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User inséré avec succès" }),
    };
  } catch (err) {
    console.error("❌ Erreur d'insertion :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur serveur" }),
    };
  }
};
