/* istanbul ignore file */
import 'module-alias/register'
import Knex from "knex" ;
import Objection, { Model } from "objection";
import con from '@Rada/knexfile'
import Campus from '@Models/Campus.model';
import Country from '@Models/Country.model';
import TableNames from "@Rada/src/Lib/constants";
import { ITimestamps } from '@Rada/src/Lib/constants/types';


const env = process.env.NODE_ENV as string || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class University extends Model   {

 public  _id?: number;
 public  name!: string;
 public  Country_id!: string;

  static get tableName(): string {
    return TableNames.University
    ;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings: Objection.RelationMappings = {
    [TableNames.Country]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: `${TableNames.University}.${TableNames.Country}_id`,
        to: `${TableNames.Country}._id`,
      },
    },
     [TableNames.Campuses]: {
      relation: Model.HasManyRelation,
      modelClass: Campus,
      join: {
        from: `${TableNames.University}._id`,
        to: `${TableNames.Campuses}.${TableNames.University}_id`,
      },
    },
    }
  };

  export interface IUniversity {
    _id?: number;
    name: string;
    Country_id: string;
    country?:string;
  }
