/* istanbul ignore file */
import "module-alias/register";
import Knex from "knex";
import con from "@Rada/knexfile";
import Campus from "@Models/Campus.model";
import Objection, { Model } from "objection";
import TableNames from "@Rada/src/Lib/constants";

const env = (process.env.NODE_ENV as string) || "development";
const config = env === "development" ? con.development : con.production;
const database = Knex(config);
Model.knex(database);

export default class User extends Model {
  public _id?: number;
  public name!: string;
  public regNo!: string;
  public email!: string;
  public password!: string;
  public profilePic!: string;
  public gender!: string;
  public dob!: string;
  public phone!: string;
  public status!: string;
  public Campuses_id!: string;
  public account_status!: string;
  public synced!: string;
  public joined!: string;


  static get tableName(): string {
    return TableNames.User;
  }

  static get idColumn(): string {
    return "_id";
  }

  public static relationMappings: Objection.RelationMappings = {
    [TableNames.Campuses]: {
      relation: Model.BelongsToOneRelation,
      modelClass: Campus,
      join: {
        from: `${TableNames.User}.${TableNames.Campuses}_id`,
        to: `${TableNames.Campuses}._id`,
      },
    },
    [TableNames.Admin_Users]: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: `${TableNames.User}._id`,
        to: `${TableNames.Admin_Users}.${TableNames.User}_id`,
      },
    },
  };
}

export interface IUser {
  _id?: number;
  name: string;
  regNo: string;
  email: string;
  password: string;
  profilePic: string;
  gender: string;
  dob: string;
  phone: string;
  status: string;
  Campuses_id: string;
  account_status: string;
  synced: string;
  joined: string;
}
