/* istanbul ignore file */
import "module-alias/register";
import Knex from "knex";
import con from "@Rada/knexfile";
import User from "@Models/User.model";
import Role from "@Models/Role.model";
import Objection, { Model } from "objection";
import TableNames from "@Rada/src/Lib/constants";
import { ITimestamps } from "@Rada/src/Lib/constants/types";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class AdminUser extends Model {
  public _id?: number;
  public name!: string;
  public Country_id!: string;

  static get tableName(): string {
    return TableNames.Admin_Users;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings: Objection.RelationMappings = {
    [TableNames.User]: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: `${TableNames.Admin_Users}.${TableNames.User}_id`,
        to: `${TableNames.User}._id`,
      },
    },
    [TableNames.Roles]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: `${TableNames.Admin_Users}.${TableNames.Roles}_id`,
        to: `${TableNames.Roles}._id`,
      },
    },
  };
}

export interface IAdminUser {
  _id?: number;
  User_id: string;
  Roles_id: string;
}
