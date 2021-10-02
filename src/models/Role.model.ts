/* istanbul ignore file */
import 'module-alias/register'
import Knex from "knex" ;
import { Model } from "objection";
import TableNames from "@Rada/src/Lib/constants";
import con from '@Rada/knexfile'
import { ITimestamps } from '@Rada/src/Lib/constants/types';
import AdminUser from './AdminUser.model';


const env = process.env.NODE_ENV as string || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class Role extends Model   {
  public _id?: number;
  public   name!: string;
  static get tableName(): string {
    return TableNames.Roles
    ;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings = {
    [TableNames.Admin_Users]: {
      relation: Model.HasOneRelation,
      modelClass: AdminUser,
      join: {
        from: `${TableNames.Roles}._id`,
        to: `${TableNames.Admin_Users}.${TableNames.Roles}_id`,
      },
    },
    }
  };

  export interface IRole  {
    _id?: number;
    name: string;
   
  }
