import { IUserRepository } from "@Repositories/User.repository";
import { ResultPayload } from "../Lib/utils/result";
import { ICounsellor } from "../models/counsellor.model";

export class AddCounsellor {
    constructor(
      private readonly repo: IUserRepository,
      private readonly config: any
    ) {}
    async add(
      user: ICounsellor
    ): Promise<
      | ResultPayload<{ msg: string; isAdded: boolean }>
      | ResultPayload<Error>
      | undefined
    > {
      try {
        const result = await this.repo.addCounsellor(user);
        return new ResultPayload<{ msg: string; isAdded: boolean }>(
          { msg: "New Counsellor Added", isAdded: result },
          200
        );
      } catch (error: any) {
        const msg =
          this.config().env !== "production"
            ? error.message
            : "Unable to add new Counsellor.Please retry";
        return new ResultPayload<Error>(new Error(msg), 500);
      }
    }
  }