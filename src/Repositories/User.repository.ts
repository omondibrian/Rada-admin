/**
 * @fileOverview contains the various functions to manage the user's data.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TableNames from "../Lib/constants";
import { IUser } from "@Models/User.model";
import { IStudent } from "@Models/Student.model";
import { IAdminUser } from "@Models/AdminUser.model";
import { ICounsellor, ISchedule } from "@Models/counsellor.model";
import { IPeerCounsellor } from "@Models/peerCounsellor.model";
import { DataBaseConnection } from "../Lib/db/connection";
import { NumberLiteralType } from "typescript";

const knexConn = new DataBaseConnection().getConnection();
export interface CounsellorData extends IUser, ICounsellor {
  rating: number;
  counsellorId?:number;
}
export interface PeerCounsellorData extends IUser, IPeerCounsellor, IStudent {}
export type IAnalytics = {
  analytics: {
    totalNoMaleUsers: number;
    totalNoFemaleUsers: number;
    totalNoCounsellors: number;
    totalNoPeerCounsellors: number;
    totalNoUsers: number;
  };
};
export interface IUserRepository {
  insert(data: IUser): Promise<IUser>;
  update(
    options: { field: string; value: string },
    data: IUser
  ): Promise<IUser>;
  find(data: { field: string; value: string }): Promise<IUser | undefined>;
  findById(id: string): Promise<IUser | undefined>;
  Delete(id: string): Promise<IUser>;
  addAdmin(data: IAdminUser): Promise<boolean>;
  addStudentDetails(data: IStudent): Promise<boolean>;
  addCounsellor(data: ICounsellor): Promise<boolean>;
  addPeerCounsellor(data: IPeerCounsellor): Promise<boolean>;
  rateCounsellor(
    id: string,
    rating: number
  ): Promise<{ currentRating: number }>;
  updateCounselorOrPeerCounsellor(
    data: {
      expertise: string;
      Campuses_id: number;
      Student_id?: number;
    },
    options: { field: string; value: string }
  ): Promise<boolean>;
  deleteCounselorOrPeerCounsellor(
    id: string,
    isPeer: boolean
  ): Promise<boolean>;
  getCounsellors(universityId: string): Promise<Array<CounsellorData>>;
  getCounsellor(id: string): Promise<CounsellorData>;
  getPeerCounsellor(id: string): Promise<PeerCounsellorData>;
  getPeerCounsellors(universityId: string): Promise<Array<PeerCounsellorData>>;
  fetchUserMetrics(): Promise<IAnalytics>;
  updateCounsellorSchedule(
    schedule: Array<ISchedule>,
    counsellorId: string
  ): Promise<boolean>;
}
export default class UserRepository implements IUserRepository {
  async rateCounsellor(
    id: string,
    rating: number
  ): Promise<{ currentRating: number }> {
    const { total_No_user_rated: noUserRated, total_rating: prevRating } =
      await this.getCounsellor(id);
    const finalUsers =
      Number.isInteger(noUserRated) && noUserRated !== undefined
        ? noUserRated + 1
        : 1;
    const finalRating =
      Number.isInteger(prevRating) && prevRating !== undefined
        ? prevRating + rating
        : rating;
        const [counsellor] = await knexConn<CounsellorData>(TableNames.Counselor)
        .where("_id", "=", id)
        .update(
          {
            total_rating:finalRating,
            total_No_user_rated: finalUsers,
          },
          ["total_rating", "total_No_user_rated"]
          );
         
    const currentRating = this.counsellorStarRating(counsellor);
    return {
      currentRating,
    };
  }
  private counsellorStarRating(counsellor: CounsellorData) {
    if (counsellor.total_rating && counsellor.total_No_user_rated) {
      return counsellor?.total_rating / counsellor.total_No_user_rated;
    } else {
      return 0;
    }
  }

  async getCounsellors(universityId: string): Promise<CounsellorData[]> {
    const result = await this.fetchCounsellor()
      .where("University_id", "=", universityId)
      .from(TableNames.User)
      .join(TableNames.Counselor, function () {
        this.on(
          `${TableNames.Counselor}.${TableNames.User}_id`,
          "=",
          `${TableNames.User}._id`
        );
      });

    return result.map((counsellor) => this.CounsellorReturnPayload(counsellor));
  }
  private CounsellorReturnPayload(result: CounsellorData): CounsellorData {
    const rating = this.counsellorStarRating(result);
    return {
      _id: result._id,
      name: result.name,
      email: result.email,
      profilePic: result.profilePic,
      password: result.password,
      gender: result.gender,
      phone: result.phone,
      status: result.status,
      account_status: result.account_status,
      dob: result.dob,
      joined: result.joined,
      synced: result.synced,
      counsellorId:result.counsellorId,
      University_id: result.University_id,
      Schedule: result.Schedule,
      expertise: result.expertise,
      rating,
      User_id: result.User_id,
      Campuses_id: result.Campuses_id,
    };
  }

  fetchCounsellor() {
    return knexConn<CounsellorData>(TableNames.Counselor).select(
      `${TableNames.User}._id`,
      `${TableNames.User}.name`,
      `${TableNames.User}.email`,
      `${TableNames.User}.profilePic`,
      `${TableNames.User}.gender`,
      `${TableNames.User}.phone`,
      `${TableNames.User}.dob`,
      `${TableNames.User}.status`,
      `${TableNames.User}.account_status`,
      `${TableNames.User}.synced`,
      `${TableNames.User}.joined`,
      `${TableNames.Counselor}._id as counsellorId`,
      `${TableNames.Counselor}.expertise`,
      `${TableNames.Counselor}.Campuses_id`,
      `${TableNames.Counselor}.Schedule`,
      `${TableNames.Counselor}.total_rating`,
      `${TableNames.Counselor}.total_No_user_rated`
    );
  }
  async getCounsellor(id: string): Promise<CounsellorData> {
    const result = await this.fetchCounsellor()
      .from(TableNames.User)
      .where(`${TableNames.Counselor}._id`, "=", id)
      .join(TableNames.Counselor, function () {
        this.on(
          `${TableNames.Counselor}.${TableNames.User}_id`,
          "=",
          `${TableNames.User}._id`
        );
      })
      .first();

    return this.CounsellorReturnPayload(result);
  }
  async getPeerCounsellors(
    universityId: string
  ): Promise<PeerCounsellorData[]> {
    const result = await this.fetchPeerCounsellor()
      .where("University_id", "=", universityId)
      .from(TableNames.User)
      .join(TableNames.peerCounselor, function () {
        this.on(
          `${TableNames.peerCounselor}.${TableNames.User}_id`,
          "=",
          `${TableNames.User}._id`
        );
      })
      .join(TableNames.Student, function () {
        this.on(
          `${TableNames.peerCounselor}.${TableNames.Student}_id`,
          "=",
          `${TableNames.Student}._id`
        );
      });
    return result;
  }
  fetchPeerCounsellor() {
    return knexConn<PeerCounsellorData>(TableNames.peerCounselor).select(
      `${TableNames.User}._id`,
      `${TableNames.User}.name`,
      `${TableNames.User}.email`,
      `${TableNames.User}.profilePic`,
      `${TableNames.User}.gender`,
      `${TableNames.User}.phone`,
      `${TableNames.User}.dob`,
      `${TableNames.User}.status`,
      `${TableNames.User}.account_status`,
      `${TableNames.User}.synced`,
      `${TableNames.User}.joined`,
      `${TableNames.Student}.regNo`,
      `${TableNames.Student}._id as student_id`,
      `${TableNames.peerCounselor}._id as peer_counsellorId`,
      `${TableNames.peerCounselor}.expertise`,
      `${TableNames.Student}.Campuses_id`
    );
  }
  async getPeerCounsellor(id: string): Promise<PeerCounsellorData> {
    const result = await this.fetchPeerCounsellor()
      .from(TableNames.User)
      .where(`${TableNames.peerCounselor}._id`, "=", id)
      .join(TableNames.peerCounselor, function () {
        this.on(
          `${TableNames.peerCounselor}.${TableNames.User}_id`,
          "=",
          `${TableNames.User}._id`
        );
      })
      .join(TableNames.Student, function () {
        this.on(
          `${TableNames.peerCounselor}.${TableNames.Student}_id`,
          "=",
          `${TableNames.Student}._id`
        );
      })
      .first();
    return result;
  }
  async fetchUserMetrics(): Promise<IAnalytics> {
    const [
      t_No_Users,
      t_No_Male_Users,
      t_No_Female_Users,
      // t_No_Un25_Users,
      // t_No_OV25_Users,
      t_No_PeerCounsellors,
      t_No_Counsellors,
    ] = await Promise.all([
      knexConn<IUser>(TableNames.User).count("_id"),
      knexConn<IUser>(TableNames.User)
        .select("gender")
        .where("gender", "=", "male")
        .groupBy("gender")
        .count("_id"),
      knexConn<IUser>(TableNames.User)
        .select("gender")
        .where("gender", "=", "female")
        .groupBy("gender")
        .count("_id"),
      //  knexConn<IUser>(TableNames.User).select('dob').where('gender','=','female').count("_id"),
      //  knexConn<IUser>(TableNames.User).select('gender').where('gender','=','female').count("_id"),
      knexConn<IUser>(TableNames.peerCounselor).count("_id"),
      knexConn<IUser>(TableNames.Counselor).count("_id"),
    ]);

    const analytics: IAnalytics = {
      analytics: {
        totalNoUsers:
          t_No_Users.length > 0
            ? parseInt(t_No_Users.pop()!.count.toString())
            : 0,
        totalNoMaleUsers:
          t_No_Male_Users.length > 0
            ? parseInt(t_No_Male_Users.pop()!.count.toString())
            : 0,
        totalNoFemaleUsers:
          t_No_Female_Users.length > 0
            ? parseInt(t_No_Female_Users.pop()!.count.toString())
            : 0,
        totalNoCounsellors:
          t_No_Counsellors.length > 0
            ? parseInt(t_No_Counsellors.pop()!.count.toString())
            : 0,
        totalNoPeerCounsellors:
          t_No_PeerCounsellors.length > 0
            ? parseInt(t_No_PeerCounsellors.pop()!.count.toString())
            : 0,
      },
    };
    return analytics;
  }

  private returnData = [
    "_id",
    "name",
    "email",
    // "regNo",
    "profilePic",
    "password",
    "gender",
    "phone",
    // "Campuses_id",
    "status",
    "account_status",
    "dob",
    "joined",
    "synced",
    "University_id",
  ];
  private userPayload(result: IUser[]): IUser | PromiseLike<IUser> {
    const [payload] = result;
    return {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      // regNo: payload.regNo,
      profilePic: payload.profilePic,
      password: payload.password,
      gender: payload.gender,
      phone: payload.phone,
      // Campuses_id: payload.Campuses_id,
      status: payload.status,
      account_status: payload.account_status,
      dob: payload.dob,
      joined: payload.joined,
      synced: payload.synced,
      University_id: payload.University_id.toString(),
    };
  }
  public insert = async (data: IUser): Promise<IUser> => {
    const result = await knexConn<IUser>(TableNames.User).insert(
      data,
      this.returnData
    );
    return this.userPayload(result);
  };

  public async update(
    options: { field: string; value: string },
    data: IUser
  ): Promise<IUser> {
    const result = await knexConn<IUser>(TableNames.User)
      .where(options.field, "=", options.value)
      .update(data, this.returnData);
    return this.userPayload(result);
  }
  async updateCounsellorSchedule(
    schedule: Array<ISchedule>,
    counsellorId: string
  ): Promise<boolean> {
    const result = await knexConn(TableNames.Counselor)
      .where("User_id", "=", counsellorId)
      .update({ Schedule: JSON.stringify(schedule) }, ["User_id", "Schedule"]);

    return result ? true : false;
  }

  public async find(data: {
    field: string;
    value: string;
  }): Promise<IUser | undefined> {
    const result = await knexConn<IUser>(TableNames.User)
      .select("*")
      .where(data.field, "=", data.value);
    return result.length > 0 ? this.userPayload(result) : undefined;
  }
  public async findById(id: string): Promise<IUser | undefined> {
    const user = await knexConn<IUser>(TableNames.User)
      .select("*")
      .where("_id", "=", id);
    return user.length > 0 ? this.userPayload(user) : undefined;
  }
  public async Delete(id: string): Promise<IUser> {
    const deletedUser = await knexConn<IUser>(TableNames.User)
      .returning(this.returnData)
      .where("_id", "=", id)
      .delete(this.returnData);
    return this.userPayload(deletedUser);
  }
  async addAdmin(data: IAdminUser): Promise<boolean> {
    const result = await knexConn<IAdminUser>(TableNames.Admin_Users).insert(
      data
    );
    return result ? true : false;
  }

  async addStudentDetails(data: IStudent): Promise<boolean> {
    const result = await knexConn<IStudent>(TableNames.Student).insert(data);
    return result ? true : false;
  }
  async addCounsellor(data: ICounsellor): Promise<boolean> {
    const result = await knexConn(TableNames.Counselor).insert({
      User_id: data.User_id,
      Campuses_id: data.Campuses_id,
      expertise: data.expertise,
      Schedule: JSON.stringify(data.Schedule),
    });
    return result ? true : false;
  }
  async addPeerCounsellor(data: IPeerCounsellor): Promise<boolean> {
    const result = await knexConn<IPeerCounsellor>(
      TableNames.peerCounselor
    ).insert(data);
    return result ? true : false;
  }
  async updateCounselorOrPeerCounsellor(
    data: {
      expertise: string;
      Campuses_id: number;
      Student_id?: number;
    },
    options: { field: string; value: string }
  ): Promise<boolean> {
    if (data.Student_id) {
      const result = await knexConn<IPeerCounsellor>(TableNames.peerCounselor)
        .where(options.field, "=", options.value)
        .update({ expertise: data.expertise });
      return result ? true : false;
    } else {
      const result = await knexConn<ICounsellor>(TableNames.Counselor)
        .where(options.field, "=", options.value)
        .update({ expertise: data.expertise });
      return result ? true : false;
    }
  }
  async deleteCounselorOrPeerCounsellor(
    id: string,
    isPeer: boolean
  ): Promise<boolean> {
    if (isPeer) {
      const deletedUser = await knexConn<IPeerCounsellor>(
        TableNames.peerCounselor
      )
        .where("_id", "=", id)
        .delete();
      return deletedUser ? true : false;
    } else {
      const deletedUser = await knexConn<ICounsellor>(TableNames.Counselor)
        .where("_id", "=", id)
        .delete();
      return deletedUser ? true : false;
    }
  }
}
