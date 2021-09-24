require("module-alias/register");
import * as Knex from "knex";
import { IUser } from "@Models/User.model";
import { IRole } from "@Rada/src/models/Role.model";
import { IRegion } from "@Rada/src/models/Region.model";
import { ICampus } from "@Rada/src/models/Campus.model";
import { ICountry } from "@Rada/src/models/Country.model";
import { IUniversity } from "@Rada/src/models/University.model";
import TableNames, { orderedTables } from "@Rada/src/Lib/constants";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await Promise.all(
    orderedTables.map(async (tableName: string) => await knex(tableName).del())
  );

  //insert role
  await knex(TableNames.Roles).insert({ name: "Admin" });
  const roleId = await knex<IRole>(TableNames.Roles)
    .select("*")
    .where("name", "=", "Admin");

  //create region
  await knex(TableNames.region).insert({ name: "EA" });
  const reg = await knex<IRegion>(TableNames.region)
    .select("*")
    .where("name", "=", "EA");
  //create country
  await knex(TableNames.Country).insert({
    name: "KENYA",
    Region_id: reg[0]._id.toString(),
  });
  const cId = await knex<ICountry>(TableNames.Country)
    .select("*")
    .where("name", "=", "KENYA");
  //create uni
  await knex<IUniversity>(TableNames.University).insert({
    name: "university",
    Country_id: cId[0]._id.toString(),
  });
  const uni = await knex<IUniversity>(TableNames.University)
    .select("*")
    .where("name", "=", "university");
  // create a new campus
  await knex<ICampus>(TableNames.Campuses).insert({
    name: "Njoro",
    University_id: uni[0]?._id?.toString() as string,
  });

  const newUser: IUser = {
    name: "test",
    // regNo: "S13/12345/11",
    email: "testUser@test.com",
    password: "test",
    profilePic: "./updatedPic.jpg",
    gender: "other",
    phone: "13011999",
    dob: "31-12-2023",
    status: "online",
    account_status: "active",
    synced: "true",
    joined: "12/01/1234",
    // Campuses_id: campusId[0]._id,
  };
  // Inserts seed entry
  const [user] = await knex(TableNames.User).insert(newUser, ["_id"]);
  await knex(TableNames.Admin_Users).insert({
    Roles_id: roleId[0]._id,
    User_id: user._id,
  });

  //create category
  const [category] = await knex(TableNames.Categories).insert(
    {
      name: "TestCategory",
    },
    ["_id"]
  );

  await knex(TableNames.Sub_Categories).insert({
    name: "test Sub Category",
    Categories_id: category._id,
  });

  await knex(TableNames.Data_types).insert({
    type: "test ",
  });

  await knex(TableNames.NewsCategories).insert({
    name: "newsTest",
  });
}
