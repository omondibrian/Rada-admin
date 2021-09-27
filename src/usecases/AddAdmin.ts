import { ResultPayload } from "../Lib/utils/result";
import { IAdminUser } from "../models/AdminUser.model";
import { IUserRepository } from "../Repositories/User.repository";

export class AddAdmin {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async add(
    user: IAdminUser
  ): Promise<
    | ResultPayload<{ msg: string; isAdded: boolean }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.addAdmin(user);
      return new ResultPayload<{ msg: string; isAdded: boolean }>(
        { msg: "New Administrator Added", isAdded: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add user as Administrator";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
