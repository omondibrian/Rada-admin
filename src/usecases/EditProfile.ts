import { IUser } from "@Models/User.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUserRepository } from "@Repositories/User.repository";

export class EditProfile {
  constructor(
    private readonly repo: IUserRepository,
    private readonly bcrypt: any,
    private readonly config: any
  ) {}
  public async update(
    userId: string,
    user: Partial<IUser>
  ): Promise<ResultPayload<Partial<IUser>> | ResultPayload<Error> | undefined> {
    try {
      let encrptedPass = "";
      let userToUpdate: Partial<IUser>;
      let updates: IUser;
      if (user.password) {
        // encrpte the password
        encrptedPass = await this.bcrypt.hash(user.password, 10);
        userToUpdate = { ...user, password: encrptedPass };
        updates = await this.repo.update(
          { field: "_id", value: userId },
          userToUpdate as IUser
        );
      } else {
        updates = await this.repo.update(
          { field: "_id", value: userId },
          user as IUser
        );
      }
      const result: Partial<IUser> = {
        _id: updates._id,
        name: updates.name,
        email: updates.email,
        profilePic: updates.profilePic,
        gender: updates.gender,
        phone: updates.phone,
        dob: updates.dob,
        status: updates.status,
        account_status: updates.account_status,
        synced: updates.synced,
        joined: updates.joined,
      };
      return new ResultPayload<Partial<IUser>>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to update Profile";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
