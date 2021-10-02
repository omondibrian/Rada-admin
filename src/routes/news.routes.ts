import { Router } from "express";
import { addPath } from "../Lib/utils/picPath";
import { Inews } from "../Repositories/news.repository";
import { NewsServiceProvider } from "../service/News.service";
const newsRoute = Router();
const newsService = new NewsServiceProvider();

newsRoute.post("/", async (req:any, res, next) => {
  try {
    const body:Inews = {
      Admin_Users_id:req.body.Admin,
      NewsCategories_id:req.body.categoryId,
      University_id:req.universityId,
      content:req.body.content,
      title:req.body.title,
      image:req.files ? encodeURIComponent(req.name): "/default",
      status:'true',

    }
    const news = await newsService.createNews.create(body);
    res.status(news?.status as number).json({
      news: news!.getResult().payload,
      message: news!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

newsRoute.get("/", async (req: any, res, next) => {
  try {
    const news = await newsService.fetchNews.fetch(req.universityId);
    res.status(news?.status as number).json({
      news: news!.getResult().payload,
      message: news!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

newsRoute.delete("/:id", async (req: any, res, next) => {
  try {
    const news = await newsService.removeNews.remove(req.params.id);
    res.status(news?.status as number).json({
      news: news!.getResult().payload,
      message: news!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

export default newsRoute;
