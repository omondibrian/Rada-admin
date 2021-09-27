import Knex from "knex";
import { config } from "dotenv";
import TableNames from "@Rada/src/Lib/constants";
import { IAdminUser } from "@Models/AdminUser.model";
import { Inews, NewsRepository } from "@Repositories/news.repository";

config();

describe("NewsRepository", () => {
  const repository = new NewsRepository();
  const testNews: Inews = {
    title: "testNews",
    content: "Testing the News Repository",
    image: "/",
    Admin_Users_id: "",
    NewsCategories_id: "",
    status: "sent",
    University_id:'1'
  };
  const conn = Knex({
    client: "pg",
    connection: {
      port: process.env.POSTGRES_PORT as unknown as number,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  });

  let newsId = 0;
  describe("NewsRepository - createNews", () => {
    it("should successfully create new NewsBulleting in database", async () => {
      const admin = await conn<IAdminUser>(TableNames.Admin_Users)
        .select("_id")
        .first();
      const categ = await conn(TableNames.NewsCategories).select("_id").first();
      testNews.Admin_Users_id = admin?._id?.toString() as string;
      testNews.NewsCategories_id = categ._id.toString() as string;
      const result = (await repository.createNews(testNews)) as {
        [key: string]: any;
      };
      testNews._id = result?._id;
      newsId = result?._id;
      const finalData: { [key: string]: any } = testNews;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(finalData[key])
      );
    });
  });
  describe("NewsRepository - fetchNews", () => {
    it("should retrive a list of all available news", async () => {
      const result = await repository.fetchNews('1');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("NewsRepository - deleteNews", () => {
    it("should remove the selected news from the database", async () => {
      const result = (await repository.deleteNews(newsId.toString())) as {
        [key: string]: any;
      };
      testNews._id = result?._id;
      const finalData: { [key: string]: any } = testNews;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(finalData[key])
      );
    });
  });
});
