import { IAdminUser } from "@Rada/src/models/AdminUser.model";
import { ICounsellor, ISchedule } from "@Rada/src/models/counsellor.model";
import { IPeerCounsellor } from "@Rada/src/models/peerCounsellor.model";
import { IStudent } from "@Rada/src/models/Student.model";
import { IUser } from "@Rada/src/models/User.model";
import {
  CounsellorData,
  IAnalytics,
  IUserRepository,
  PeerCounsellorData,
} from "@Rada/src/Repositories/User.repository";

export class UserMockRepository implements IUserRepository {
  rateCounsellor(id: string, rating: number): Promise<{ currentRating: number; }> {
    throw new Error("Method not implemented.");
  }
  insert(data: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  update(
    options: { field: string; value: string },
    data: IUser
  ): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  find(data: { field: string; value: string }): Promise<IUser | undefined> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<IUser | undefined> {
    throw new Error("Method not implemented.");
  }
  Delete(id: string): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  addAdmin(data: IAdminUser): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  addStudentDetails(data: IStudent): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  addCounsellor(data: ICounsellor): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  addPeerCounsellor(data: IPeerCounsellor): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateCounselorOrPeerCounsellor(
    data: {
      expertise: string;
      Campuses_id: number;
      Student_id?: number | undefined;
    },
    options: { field: string; value: string }
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteCounselorOrPeerCounsellor(
    id: string,
    isPeer: boolean
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getCounsellors(): Promise<CounsellorData[]> {
    throw new Error("Method not implemented.");
  }
  getCounsellor(id: string): Promise<CounsellorData> {
    throw new Error("Method not implemented.");
  }
  getPeerCounsellor(id: string): Promise<PeerCounsellorData> {
    throw new Error("Method not implemented.");
  }
  getPeerCounsellors(): Promise<PeerCounsellorData[]> {
    throw new Error("Method not implemented.");
  }
  fetchUserMetrics(): Promise<IAnalytics> {
    throw new Error("Method not implemented.");
  }
  updateCounsellorSchedule(
    schedule: ISchedule[],
    counsellorId: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
