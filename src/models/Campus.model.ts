/* istanbul ignore file */
import Knex from "knex" ;
import 'module-alias/register'
import con from '@Rada/knexfile'
import User from '@Models/User.model';
import Objection, { Model } from "objection";
import TableNames from "@Rada/src/Lib/constants";
import University from '@Models/University.model';


const env = process.env.NODE_ENV as string || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class Campus extends Model   {

 public _id ?: number;
 public name!: string;
 public University_id!: string;

  static get tableName(): string {
    return TableNames.Campuses
    ;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings: Objection.RelationMappings = {
    [TableNames.University]: {
      relation: Model.BelongsToOneRelation,
      modelClass: University,
      join: {
        from: `${TableNames.Campuses}.${TableNames.University}_id`,
        to: `${TableNames.University}._id`,
      },
    },
     [TableNames.User]: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: `${TableNames.Campuses}._id`,
        to: `${TableNames.User}.${TableNames.Campuses}_id`,
      },
    },
    }
  };

  export interface ICampus  {
    _id?: number;
    name: string;
    university?:string;
    University_id: string;
  }
