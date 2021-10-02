import { ResultPayload } from "../Lib/utils/result";
import { IAdminRoleRepository } from "../Repositories/Role.repository";
import { IAdminUser } from "../models/AdminUser.model";

export class AssignUserRole {
  constructor(
    private readonly repo: IAdminRoleRepository,
    private readonly config: any
  ) {}
  async add(
    admin: IAdminUser
  ): Promise<
    | ResultPayload<{ msg: string; adminMetaData: IAdminUser }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.assingUserRole(admin);
      return new ResultPayload<{ msg: string; adminMetaData: IAdminUser }>(
        { msg: "New admin Added", adminMetaData: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new admin";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
