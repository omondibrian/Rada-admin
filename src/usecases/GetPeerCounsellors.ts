import { ResultPayload } from "../Lib/utils/result";
import { PeerCounsellorData, IUserRepository } from "@Repositories/User.repository";

export class GetPeerCounsellors {
    constructor(
      private readonly repo: IUserRepository,
      private readonly config: any
    ) {}
    async fetch(
      
    ): Promise<
      | ResultPayload<Array<PeerCounsellorData>>
      | ResultPayload<Error>
      | undefined
    > {
      try {
        const result = await this.repo.getPeerCounsellors();
        return new ResultPayload<Array<PeerCounsellorData>>(
          result,
          200
        );
      } catch (error: any) {
        const msg =
          this.config().env !== "production"
            ? error.message
            : "Unable to retrive Counsellors.Please retry";
        return new ResultPayload<Error>(new Error(msg), 500);
      }
    }
  }