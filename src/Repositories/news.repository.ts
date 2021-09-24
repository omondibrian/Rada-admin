/**
 * @fileOverview contains the various functions to manage news data.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TableNames from "../Lib/constants";
import { DataBaseConnection } from "../Lib/db/connection";

export interface INewsRepository {
  createNews(news: Inews): Promise<Inews>;
  fetchNews(): Promise<Array<Inews>>;
  deleteNews(id:string): Promise<Inews>;
}

export interface Inews {
  _id?: number;
  title: string;
  content: string;
  image: string;
  NewsCategories_id: string;
  Admin_Users_id: string;
  status: string;
}

export class NewsRepository implements INewsRepository {
  private knexConn = new DataBaseConnection().getConnection();
  private returnData = [
    "_id",
    "title",
    "content",
    "image",
    "NewsCategories_id",
    "Admin_Users_id",
    "status",
  ];
  private returnNewsPayload(result: any): Inews {
    return {
      _id: result._id,
      title: result.title,
      content: result.content,
      image: result.image,
      NewsCategories_id: result.NewsCategories_id.toString(),
      Admin_Users_id: result.Admin_Users_id.toString(),
      status: result.status,
    };
  }
  async createNews(news: Inews): Promise<Inews> {
    const [result] = await this.knexConn<Inews>(TableNames.News).insert(
      news,
      this.returnData
    );
    return this.returnNewsPayload(result);
  }

  async fetchNews(): Promise<Array<Inews>> {
    const result = await this.knexConn<Inews>(TableNames.News).select(
      ...this.returnData
    );
    return result.map((news) => this.returnNewsPayload(news));
  }
 async deleteNews(id:string): Promise<Inews> {
    const [deletedNews] = await this.knexConn<Inews>(TableNames.News)
      .returning(this.returnData)
      .where("_id", "=", id)
      .delete(this.returnData);
    return this.returnNewsPayload(deletedNews)
  }
}
