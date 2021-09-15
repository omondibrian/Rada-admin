/* istanbul ignore file */
import "module-alias/register";
import Knex from "knex";
import { Model } from "objection";
import TableNames from "@Rada/src/Lib/constants";
import con from "@Rada/knexfile";
import { ITimestamps } from "@Rada/src/Lib/constants/types";
import Country from "@Models/Country.model";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class Region extends Model {

  public _id?: number;
  public name!: string;
  static get tableName(): string {
    return TableNames.User;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings = {
    [TableNames.Country]: {
      relation: Model.HasManyRelation,
      modelClass: Country,
      join: {
        from: `${TableNames.region}._id`,
        to:  `${TableNames.Country}.${TableNames.region}_id`,
      },
    },
  };
}

 export interface IRegion extends ITimestamps {
  _id: number;
  name: string;
}
