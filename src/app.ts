import { TokenMiddleware } from './Lib/middleware';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import { config } from "dotenv";
import compression from "compression";
import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes";
import contentRoutes from "./routes/content.routes";
import contactsRoutes from "./routes/contacts.routes";
import locationRoutes from "./routes/locations.routes";
import universityRoutes from "./routes/University.routes";
import newsRoute from './routes/news.routes';
import rolesRoute from './routes/roles.routes';
import { initMinIO } from './Lib/minio';

config();
const app = express();
app.set("PORT", process.env.PORT || "4040");

export async function start() {
  const minio = await initMinIO();
  const minioBucket = "image-storage";
  
  app.get("/api/v1/uploads/:name", async (req, res) => {
    try {
      const stream = await minio.getObject(
        minioBucket,
        decodeURIComponent(req.params.name)
        );
      stream.pipe(res);
      
    } catch (error) {
      res.send('resource not found')
    }
  });
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
    );
  app.use(cors());
  app.use(helmet());
  app.use(fileUpload());
  app.use(compression());
  app.use(morgan("tiny"));

  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/university", universityRoutes);
  app.use("/api/v1/news", TokenMiddleware, newsRoute);
  app.use("/api/v1/role", TokenMiddleware, rolesRoute);
  app.use("/api/v1/content", TokenMiddleware, contentRoutes);
  app.use("/api/v1/contact", TokenMiddleware, contactsRoutes);
  app.use("/api/v1/location", TokenMiddleware, locationRoutes); 
}

export default app;
