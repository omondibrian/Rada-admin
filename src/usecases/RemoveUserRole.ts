import { ResultPayload } from "../Lib/utils/result";
import { IAdminUser } from "@Models/AdminUser.model";
import { IAdminRoleRepository } from "@Repositories/Role.repository";

export class RemoveUserRole {
  constructor(
    private readonly repo: IAdminRoleRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string
  ): Promise<
    | ResultPayload<{ msg: string; admin:IAdminUser}>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.removeUserRole(id);
      return new ResultPayload<{ msg: string;admin:IAdminUser}>(
        { msg: "successfully removed user", admin: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove user's role or user has insufficient permissions";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
