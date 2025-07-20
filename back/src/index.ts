import express from "express";
import userRoutes from "./routes/user";
import notificationRoutes from "./routes/notification";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import channelBotRoutes from "./routes/channelBot";
import authRoutes from "./routes/auth";
import cors from "cors";
import messageBotRoutes from "./routes/messageBot";
import userVideoRoutes from "./routes/userVideo";
import videoCommentRoutes from "./routes/videoComment";
import videoLikeRoutes from "./routes/videoLike";
import notificationReadRoutes from "./routes/notificationRead";
import firstPagePromotionVideoRoutes from "./routes/firstPagePromotionVideo";
import badgeRoutes from "./routes/badge";
import userBadgeRoutes from "./routes/userBadge";
import userFollowingRoutes from "./routes/userFollowing";
import userSanctionRoutes from "./routes/userSanction";
import groupRoutes from "./routes/group";
import groupMemberRoutes from "./routes/groupMember";
import leagueRoutes from "./routes/league";
import mapRoutes from "./routes/map";
import mapPickbanRoutes from "./routes/mapPickban";
import matchRoutes from "./routes/match";
import matchChatRoutes from "./routes/matchChat";
import matchMapRoutes from "./routes/matchMap";
import pinnedMessageTeamRoutes from "./routes/pinnedMessageTeam";
import roomRoutes from "./routes/room";
import shopItemRoutes from "./routes/shopItem";
import teamRoutes from "./routes/team";
import teamChatRoutes from "./routes/teamChat";
import teamMemberRoutes from "./routes/teamMember";
import teamSubscriptionRoutes from "./routes/teamSubscription";
import tournamentRoutes from "./routes/tournament";
import tournamentMapRoutes from "./routes/tournamentMap";
import { registerRoutes } from "./registerRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

registerRoutes(app);

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
  console.log(`Server running on http://localhost:${PORT}/api-docs`);
});
