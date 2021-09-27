import { ResultPayload } from "../Lib/utils/result";
import { CounsellorData, IUserRepository } from "@Repositories/User.repository";

export class GetCounsellor {
    constructor(
      private readonly repo: IUserRepository,
      private readonly config: any
    ) {}
    async fetch(
      id:string
    ): Promise<
      | ResultPayload<CounsellorData>
      | ResultPayload<Error>
      | undefined
    > {
      try {
        const result = await this.repo.getCounsellor(id);
        return new ResultPayload<CounsellorData>(
          result,
          200
        );
      } catch (error: any) {
        const msg =
          this.config().env !== "production"
            ? error.message
            : "Unable to retrive Counsellor.Please retry";
        return new ResultPayload<Error>(new Error(msg), 500);
      }
    }
  }