import Knex from "knex";
require("module-alias/register");
import { config } from "dotenv";
import User, { IUser } from "@Models/User.model";
import TableNames from "@Rada/src/Lib/constants";
import { IStudent } from "@Models/Student.model";
import { IAdminUser } from "@Models/AdminUser.model";
import { ICounsellor, ISchedule } from "@Models/counsellor.model";
import UserRepository from "@Repositories/User.repository";
import { IPeerCounsellor } from "@Models/peerCounsellor.model";

config();

describe("UserRepository", () => {
  const repository = new UserRepository();
  const testData: IUser = {
    name: "testUser",
    email: "testUser1@test.com",
    password: "test",
    profilePic: "./updatedPic.jpg",
    gender: "other",
    phone: "13011999",
    dob: "31-12-2023",
    status: "online",
    account_status: "active",
    synced: "true",
    joined: "12/01/1234",
  };
  let userId = 0;

  const updatedData: { [key: string]: any } = {
    name: "Updatedtest",

    email: "newtestUser@test.com",
    phone: "13011998",
    joined: "12/01/1234",
    password: "test",
    status: "online",
    account_status: "active",

    profilePic: "./updatedPicture.jpg",
    dob: "31-12-2024",
    synced: "true",
    gender: "male",
  };

  const studentData = {
    regNo: "S13/12345/11",
    User_id: userId?.toString() as string,
    Campuses_id: 1,
  };

  const peerCounsellorData = {
    expertise: "HIV/AIDS",
    User_id: userId?.toString() as string,
    Campuses_id: 1,
  };

  afterAll(async () => {
    await User.query().delete().where("name", "=", updatedData.name);

    await User.knex().destroy();
  });
  describe("UserRepository - Insert", () => {
    it("should successfully insert the new User Detail based on the specified Data", async () => {
      const result = (await repository.insert(testData)) as {
        [key: string]: any;
      };
      testData._id = result._id;
      userId = result._id;
      const testObj: { [key: string]: any } = testData;

      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(testObj[key])
      );
    }, 20000);
  });

  describe("UserRepository - Update", () => {
    it("should successfully Update the new User details based on the specified data", async () => {
      const result = (await repository.update(
        { field: "email", value: testData.email },
        updatedData as IUser
      )) as { [key: string]: any };
      updatedData._id = result._id;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(updatedData[key])
      );
    });
  });

  describe("UserRepository - find", () => {
    const data = { field: "email", value: "newtestUser@test.com" };
    it("should successfully retrive  User data based on the specified parameters", async () => {
      const result = (await repository.find(data)) as { [key: string]: any };
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(updatedData[key])
      );
    });
  });

  describe("UserRepository - findById", () => {
    const data = { field: "email", value: "newtestUser@test.com" };

    it("should successfully retrive  User data based on the specified parameters", async () => {
      const { _id } = (await repository.find(data)) as User;
      const result = (await repository.findById(_id + "")) as {
        [key: string]: any;
      };
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(updatedData[key])
      );
    });
  });

  describe("UserRepository - addAdmin", () => {
    it("should successfully add a new admin", async () => {
      const adminUser: IAdminUser = {
        User_id: userId?.toString() as string,
        Roles_id: "1",
      };
      const result = await repository.addAdmin(adminUser);
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - addStudent", () => {
    it("should successfully add a new student data", async () => {
      const student: IStudent = {
        Campuses_id: 1,
        regNo: "S13/12345/12",
        User_id: userId,
      };
      const result = await repository.addStudentDetails(student);
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - addCounselor", () => {
    it("should successfully add a new counselor data", async () => {
      const counselor: ICounsellor = {
        Campuses_id: 1,
        expertise: "TestExpertise",
        User_id: userId,
        Schedule: [
          {
            day: "MON",
            active: {
              from: "0800h",
              to: "1600h",
            },
          },
        ],
      };
      const result = await repository.addCounsellor(counselor);
      expect(result).toBeTruthy();
    });
  });
  describe("UserRepository - updateCounsellorSchedule", () => {
    const schedule: Array<ISchedule> = [
      {
        day: "MON",
        active: {
          from: "0800h",
          to: "1600h",
        },
      },
      {
        day: "Tue",
        active: {
          from: "0800h",
          to: "1600h",
        },
      },
    ];
    it("should sucessfully update counnsellor Schedule", async () => {
      const result = await repository.updateCounsellorSchedule(
        schedule,
        userId.toString()
      );
      expect(result).toBeTruthy();
    });
  });

  const conn = Knex({
    client: "pg",
    connection: {
      port: process.env.POSTGRES_PORT as unknown as number,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  });
  describe("UserRepository - addPeerCounselor", () => {
    it("should successfully add a new peer counselor data", async () => {
      const peerCounselor: IPeerCounsellor = await getPeerCounsellor(
        conn,
        userId
      );
      const result = await repository.addPeerCounsellor(peerCounselor);
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - updateCounselorOrPeerCounsellor", () => {
    const counsellorData: ICounsellor = {
      expertise: "HIV/AIDS",
      User_id: userId,
      Campuses_id: 1,
      Schedule: [
        {
          day: "MON",
          active: {
            from: "0800h",
            to: "1600h",
          },
        },
      ],
    };
    it("should successfully update counsellor data", async () => {
      const result = repository.updateCounselorOrPeerCounsellor(
        counsellorData,
        {
          field: "User_id",
          value: userId.toString(),
        }
      );
      expect(result).toBeTruthy();
    });

    it("should successfully update  peerCounsellor data", async () => {
      const peerCounselor: IPeerCounsellor = await getPeerCounsellor(
        conn,
        userId,
        "Alcohol&SubstanceAbuse"
      );
      const result = repository.updateCounselorOrPeerCounsellor(peerCounselor, {
        field: "Student_id",
        value: peerCounselor.Student_id.toString(),
      });
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - GetCounsellors", () => {
    it("Should successfully retrive the available counsellors", async () => {
      const result = await repository.getCounsellors();
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("UserRepository - GetPeerCounsellors", () => {
    it("Should successfully retrive the available PeerCounsellors", async () => {
      const result = await repository.getPeerCounsellors();
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("UserRepository - GetCounsellor", () => {
    it("Should successfully retrive the requested counsellor", async () => {
      const [counselor] = await getCounsellor(conn, userId);
      const result = await repository.getCounsellor(counselor._id);
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - GetPeerCounsellor", () => {
    it("Should successfully retrive the requested PeerCounsellor", async () => {
      const [peerCounselor] = await conn<IPeerCounsellor>(
        TableNames.peerCounselor
      )
        .select("_id")
        .where("User_id", "=", userId);
      const result = await repository.getPeerCounsellor(peerCounselor._id);
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - fetchUserMetrics", () => {
    it(
      "should successfully fetch user metrics i.e Total No. Of users" +
        ",male-Users,female-Users,Counsellors,PeerCounsellors",
      async () => {
        const { analytics } = await repository.fetchUserMetrics();
        expect(analytics.totalNoUsers).toBeGreaterThanOrEqual(0);
        expect(analytics.totalNoMaleUsers).toBeGreaterThanOrEqual(0);
        expect(analytics.totalNoFemaleUsers).toBeGreaterThanOrEqual(0);
        expect(analytics.totalNoCounsellors).toBeGreaterThanOrEqual(0);
        expect(analytics.totalNoPeerCounsellors).toBeGreaterThanOrEqual(0);
      }
    );
  });

  describe("UserRepository - deleteCounselorOrPeerCounsellor", () => {
    it("should successfully remove the specified  counselor", async () => {
      const [counselor] = await getCounsellor(conn, userId);
      const result = await repository.deleteCounselorOrPeerCounsellor(
        counselor._id,
        false
      );
      expect(result).toBeTruthy();
    });
    it("should successfully remove the specified peercounselor", async () => {
      const [peerCounselor] = await conn<IPeerCounsellor>(
        TableNames.peerCounselor
      )
        .select("_id")
        .where("User_id", "=", userId);
      const result = await repository.deleteCounselorOrPeerCounsellor(
        peerCounselor._id,
        true
      );
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - Delete", () => {
    const data = { field: "email", value: "newtestUser@test.com" };

    it("should successfully Delete  User data based on the specified parameters", async () => {
      const { _id } = (await repository.find(data)) as User;
      const result = (await repository.Delete(_id + "")) as {
        [key: string]: any;
      };
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(updatedData[key])
      );
    });
  });
});

async function getCounsellor(
  conn: Knex<any, unknown[]>,
  userId: number
): Promise<any> {
  return await conn<ICounsellor>(TableNames.Counselor)
    .select("_id")
    .where("User_id", "=", userId);
}

async function getPeerCounsellor(
  conn: Knex<any, unknown[]>,
  userId: number,
  expertise = "TestExpertise"
) {
  const [studentId] = await conn<IStudent>(TableNames.Student)
    .select("_id")
    .where("User_id", "=", userId);
  const peerCounselor: IPeerCounsellor = {
    Campuses_id: 1,
    expertise,
    Student_id: studentId._id,
    User_id: userId,
  };
  return peerCounselor;
}
