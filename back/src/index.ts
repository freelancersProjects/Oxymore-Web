import express from "express";
import userRoutes from "./routes/user";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import channelRoutes from "./routes/channel";
import messageRoutes from "./routes/message";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Oxymore API",
      version: "1.0.0",
      description: "Documentation de l'API Oxymore"
    },
    servers: [
      { url: `http://localhost:${PORT}` }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
