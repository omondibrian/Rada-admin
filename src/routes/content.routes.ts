import { Router } from "express";
import { contentMiddleware } from "../Lib/middleware";
import { ContentService } from "../service/Content.service";
import { IContent } from "@Repositories/content.repository";

const contentRoutes = Router();
const contentService = new ContentService();

contentRoutes.get("/", async (req: any, res, next) => {
  try {
    const content = await contentService.fetchContents.fetch(req.universityId);
    res.status(content?.status as number).json({
      content: content!.getResult().payload,
      message: content!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

contentRoutes.get("/:id", async (req: any, res, next) => {
  try {
    const content = await contentService.fetchContent.fetch(req.params.id);
    res.status(content?.status as number).json({
      content: content!.getResult().payload,
      message: content!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

contentRoutes.post("/", contentMiddleware, async (req: any, res, next) => {
  try {
    const newContent: IContent = {
      path: req.files ?encodeURIComponent(req.name) : "/default",
      content: req.body.content,
      University_id: req.universityId,
      Data_types_id: req.body.Data_types_id,
      Admin_Users_id: req.body.Admin_Users_id,
      Sub_Categories_id: req.body.Sub_Categories_id,
    };
    const content = await contentService.addContent.create(newContent);
    res.status(content?.status as number).json({
      content: content!.getResult().payload,
      message: content!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

contentRoutes.put("/:id", contentMiddleware, async (req: any, res, next) => {
  try {
    const content = await contentService.updateContent.mod(
      req.params.id,
      req.body
    );
    res.status(content?.status as number).json({
      content: content!.getResult().payload,
      message: content!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

contentRoutes.delete("/:id", async (req: any, res, next) => {
  try {
    const content = await contentService.deleteContent.remove(req.params.id);
    res.status(content?.status as number).json({
      content: content!.getResult().payload,
      message: content!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

export default contentRoutes;
