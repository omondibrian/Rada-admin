/* istanbul ignore file */
import "module-alias/register";
import Knex from "knex";
import Objection, { Model } from "objection";
import con from "@Rada/knexfile";
import Region from "@Models/Region.model";
import TableNames from "@Rada/src/Lib/constants";
import University from "@Models/University.model";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class Country extends Model {

  public _id?: number;
  public name!: string;
  public Region_id!: string;
  
  static get tableName(): string {
    return TableNames.Country;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings : Objection.RelationMappings= {
    [TableNames.region]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Region,
      join: {
        from: `${TableNames.Country}.${TableNames.region}_id`,
        to: `${TableNames.region}._id`,
      },
    },
     [TableNames.University]: {
      relation: Model.HasManyRelation,
      modelClass: University,
      join: {
        from: `${TableNames.Country}._id`,
        to: `${TableNames.University}.${TableNames.Country}_id`,
      },
    },
  };
}

export interface ICountry {
  _id: number;
  name: string;
  Region_id: string;
}
