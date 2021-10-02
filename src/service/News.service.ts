import { NewsRepository } from "../Repositories/news.repository";
import { CreateNews } from "../usecases/CreateNews";
import { DeleteNews } from "../usecases/DeleteNews";
import { FetchNews } from "../usecases/FetchNews";

export class NewsServiceProvider {
  private readonly repo = new NewsRepository();
  private config() {
    return {
      env: process.env.NODE_ENV,
      multiTenantMode: process.env.MODE === "true" ? true : false,
    };
  }

  createNews = new CreateNews(this.repo,this.config);
  fetchNews = new FetchNews(this.repo,this.config)
  removeNews = new DeleteNews(this.repo,this.config);

}
