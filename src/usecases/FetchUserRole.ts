import { ResultPayload } from "../Lib/utils/result";
import { IAdminRoleRepository } from "@Repositories/Role.repository";

export class FetchUserRole {
  constructor(
    private readonly repo: IAdminRoleRepository,
    private readonly config: any
  ) {}
  async fetch(
    id: string
  ): Promise<
    | ResultPayload<{ msg: string; role:Array<{name:string,id:string}> }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.fetchUserRole(id);
      return new ResultPayload<{ msg: string; role:Array<{name:string,id:string}>}>(
        { msg: "user roles", role: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to fetch user role or user has insufficient permissions";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
