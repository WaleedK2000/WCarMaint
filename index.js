const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const app = express();

require("dotenv").config();
const User = require("./models/User");

const userMangementRoutes = require("./routes/userManagement");
const carManagementRoutes = require("./routes/carManagement");
const fuelLogManagementRoutes = require("./routes/fuelLogManagement");

const credential = new DefaultAzureCredential();
const client = new SecretClient(process.env.KEYVAULT_URI, credential);

app.use(express.json());
app.use(cors());

app.use("/api/users", userMangementRoutes);
app.use("/api/cars", carManagementRoutes);
app.use("/api/fuelLogs", fuelLogManagementRoutes);

// app.use("/api/nodes", nodesRouter);
// app.use("/api/exploits", exploits);
// app.use("/api/data", data);

try {
  async function connectToMongoDB() {
    try {
      let password = await client.getSecret("mongodb-password");

      const username = "waleed";

      const connectionString = `mongodb+srv://${encodeURIComponent(
        username
      )}:${encodeURIComponent(
        password.value
      )}@cbas-backend.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }

  connectToMongoDB();

  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server listening on port ${port}`));

  const username = "waleed";

  const connectionString = `mongodb+srv://${encodeURIComponent(
    username
  )}:${encodeURIComponent(
    password
  )}@cbas-backend.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
}
