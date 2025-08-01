import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { createServer } from "http";
import { registerRoutes } from "./registerRoutes";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));
app.use(express.json());


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
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

registerRoutes(app);



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Oxymore API Documentation"
}));

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
});
