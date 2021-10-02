import { IRole } from "@Models/Role.model";
import { ResultPayload } from "../Lib/utils/result";
import { IAdminRoleRepository } from "@Repositories/Role.repository";

export class RemoveRole {
  constructor(
    private readonly repo: IAdminRoleRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string
  ): Promise<
    | ResultPayload<{ msg: string; role:IRole}>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.removeRole(id);
      return new ResultPayload<{ msg: string;role:IRole}>(
        { msg: "successfully removed Role", role: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove role .Please Retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}