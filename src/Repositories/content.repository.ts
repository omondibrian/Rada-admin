/**
 * @fileOverview contains the various functions to manage contents data.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { config } from "dotenv";
import TableNames from "../Lib/constants";
import { DataBaseConnection } from "../Lib/db/connection";

config();
const knexConn = new DataBaseConnection().getConnection();

export interface IContentRepository {
  createContent(data: IContent): Promise<IContent>;
  fetchContents(universityId: string): Promise<Array<IContent>>;
  fetchContent(id: string): Promise<IContent>;
  EditContent(id: string, data: IContent): Promise<IContent>;
  DeleteContent(id: string): Promise<IContent>;
}

export interface IContent {
  _id?: string;
  content: string;
  path: string;
  Data_types_id: string;
  Sub_Categories_id: string;
  Admin_Users_id: string;
  University_id: string;
}

const returnDAta = [
  "_id",
  "content",
  "path",
  "Data_types_id",
  "Sub_Categories_id",
  "Admin_Users_id",
  "University_id",
];

export class ContentRepository implements IContentRepository {
  private returnContentPayload(result: any): IContent {
    return {
      _id: result._id.toString(),
      content: result.content,
      path: result.path,
      Data_types_id: result.Data_types_id.toString(),
      Sub_Categories_id: result.Sub_Categories_id.toString(),
      Admin_Users_id: result.Admin_Users_id.toString(),
      University_id: result.University_id.toString(),
    };
  }
  async createContent(data: IContent): Promise<IContent> {
    const [result] = await knexConn<IContent>(TableNames.Contents).insert(
      data,
      returnDAta
    );
    return this.returnContentPayload(result);
  }

  async fetchContents(universityId: string): Promise<IContent[]> {
    const results = await knexConn<IContent>(TableNames.Contents)
      .select(...returnDAta)
      .where("University_id", "=", universityId);
    const result = results.map((result) => this.returnContentPayload(result));
    return result;
  }
  async fetchContent(id: string): Promise<IContent> {
    const result = await knexConn<IContent>(TableNames.Contents)
      .select(...returnDAta)
      .where("_id", "=", id)
      .first();
    return this.returnContentPayload(result);
  }
  async EditContent(id: string, data: IContent): Promise<IContent> {
    const [result] = await knexConn<IContent>(TableNames.Contents)
      .where("_id", "=", id)
      .update(data, returnDAta);
    return this.returnContentPayload(result);
  }
  async DeleteContent(id: string): Promise<IContent> {
    const [deletedContent] = await knexConn<IContent>(TableNames.Contents)
      .returning(returnDAta)
      .where("_id", "=", id)
      .delete(returnDAta);
    return this.returnContentPayload(deletedContent);
  }
}
