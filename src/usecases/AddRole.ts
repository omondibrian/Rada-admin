import { IRole } from "../models/Role.model";
import { ResultPayload } from "../Lib/utils/result";
import { IAdminRoleRepository } from "../Repositories/Role.repository";

export class AddRole {
  constructor(
    private readonly repo: IAdminRoleRepository,
    private readonly config: any
  ) {}
  async add(
    role: IRole
  ): Promise<
    | ResultPayload<{ msg: string; roleMetaData: IRole }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      role.name = role.name.toUpperCase()
      const result = await this.repo.addRole(role);
      return new ResultPayload<{ msg: string; roleMetaData: IRole }>(
        { msg: "New Role Added", roleMetaData: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new Role";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
