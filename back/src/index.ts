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

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://oxymore-web-oxymore-admin.vercel.app",
      "https://oxymore-web-oxymore-app.vercel.app",
      "https://oxymore-web-oxymore-site.vercel.app",
      "https://mathis.alwaysdata.net"
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Oxymore API",
      version: "1.0.0",
      description: "Oxymore API Documentation",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local Development (Default)",
        variables: {}
      },
      {
        url: "https://mathis.alwaysdata.net",
        description: "Alwaysdata Production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

registerRoutes(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Oxymore API Documentation",
  swaggerOptions: {
    url: `http://localhost:${PORT}`,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    displayRequestDuration: true,
    docExpansion: "list",
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    persistAuthorization: true,
    defaultModelRendering: "model",
    supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
    operationsSorter: "alpha",
    tagsSorter: "alpha"
  }
}));

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
});
