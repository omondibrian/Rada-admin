import { IUser } from "@Models/User.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUserRepository } from "@Repositories/User.repository";

export class ViewProfile {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}

  public async profile(
    userId: string
  ): Promise<ResultPayload<IUser> | ResultPayload<Error> | undefined> {
    try {
      const profile = (await this.repo.findById(userId)) as IUser;
      const user: IUser = {
        name: profile.name,
        email: profile.email,
        password: profile.password,
        profilePic: profile.profilePic,
        gender: profile.gender,
        phone: profile.phone,
        dob: profile.dob,
        status: profile.status,
        account_status: profile.account_status,
        synced: profile.synced,
        joined: profile.joined,
      };

      const result = new ResultPayload<IUser>(user, 200);
      return result;
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to fetch Profile";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
