require("module-alias/register");
import AdminUser, { IAdminUser } from "@Models/AdminUser.model";
import User, { IUser } from "@Models/User.model";
import Campus from "../../../src/models/Campus.model";
import Country from "../../../src/models/Country.model";
import Region from "../../../src/models/Region.model";
import Role from "../../../src/models/Role.model";
import University from "../../../src/models/University.model";
import UserRepository from "../../../src/Repositories/User.repository";

describe("UserRepository", () => {
  const testData: IUser = {
    name: "test",
    regNo: "S13/12345/11",
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
    Campuses_id: "1",
  };
  const adminUser: IAdminUser = {
    User_id: "1",
    Roles_id: "1",
  };
  let roleId = 0,
    reg = 0,
    cId = 0,
    uni = 0,
    id = 0;
  const repository = new UserRepository();
  beforeAll(async () => {
    //insert role
    roleId = (await Role.query().insertAndFetch({ name: "Admin" }))
      ._id as number;
    //create region
    reg = (await Region.query().insertAndFetch({ name: "EA" }))._id as number;
    //create country
    cId = (
      await Country.query().insertAndFetch({
        name: "KENYA",
        Region_id: reg.toString(),
      })
    )._id as number;
    //create uni
    uni = (
      await University.query().insert({
        name: "university",
        Country_id: cId.toString(),
      })
    )._id as number;
    // // create a new campus
    id = (
      await Campus.query().insertAndFetch({
        name: "Njoro",
        University_id: uni.toString(),
      })
    )._id as number;
    // await AdminUser.query().insert(adminUser);
  });

  afterAll(async () => {
    await User.query().delete().where("name", "=", testData.name);
    await Role.query().deleteById(roleId);
    await Region.query().deleteById(reg);
    await Country.query().deleteById(cId);
    await University.query().deleteById(uni);
    await Campus.query().deleteById(id);
    await User.knex().destroy();
  });
  describe("UserRepository - Insert", () => {
    it("should successfully insert the new User Detail based on the specified Data", async () => {
      const result =  await repository.insert(testData) as {
        [key: string]: any;
      };
      const testObj: { [key: string]: any } = testData;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(testObj[key])
      );
    },20000);
  });
  // const updatedData: { [key: string]: any } = {
  //   name: "test",
  //   Campuses_id: "1",
  //   email: "testUser1@test.com",
  //   phone: "13011998",
  //   joined: "12/01/1234",
  //   password: "test",
  //   status: "online",
  //   account_status: "active",
  //   regNo: "S13/12345/11",
  //   profilePic: "./updatedPicture.jpg",
  //   dob: "31-12-2024",
  //   synced: "true",
  //   gender: "male",
  // };
  // describe("UserRepository - Update", () => {
  //   it("should successfully Update the new User details based on the specified data", async () => {
  //     const result = (await repository.update(
  //       { field: "email", value: testData.email },
  //       updatedData as IUser
  //     )) as { [key: string]: any };
  //     Object.keys(result).forEach((key) =>
  //       expect(result[key]).toEqual(updatedData[key])
  //     );
  //   });
  // });

  // describe("UserRepository - find", () => {
  //   const data = { field: "email", value: "johnDoe@testEmail.com" };
  //   it("should successfully retrive  User data based on the specified parameters", async () => {
  //     const result = (await repository.find(data)) as { [key: string]: any };
  //     Object.keys(result).forEach((key) =>
  //       expect(result[key]).toEqual(updatedData[key])
  //     );
  //   });
  // });

  // describe("UserRepository - findById", () => {
  //   const data = { field: "email", value: "johnDoe@testEmail.com" };

  //   it("should successfully retrive  User data based on the specified parameters", async () => {
  //     const { _id } = (await repository.find(data)) as User;
  //     const result = (await repository.findById(_id + "")) as {
  //       [key: string]: any;
  //     };
  //     Object.keys(result).forEach((key) =>
  //       expect(result[key]).toEqual(updatedData[key])
  //     );
  //   });
  // });

  // describe("UserRepository - Delete", () => {
  //   const data = { field: "email", value: "johnDoe@testEmail.com" };

  //   it("should successfully Delete  User data based on the specified parameters", async () => {
  //     const { _id } = (await repository.find(data)) as User;
  //     const result = (await repository.Delete(_id + "")) as {
  //       [key: string]: any;
  //     };
  //     Object.keys(result).forEach((key) =>
  //       expect(result[key]).toEqual(updatedData[key])
  //     );
  //   });
  // });
});
