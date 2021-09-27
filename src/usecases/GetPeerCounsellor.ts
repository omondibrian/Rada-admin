import { ResultPayload } from "../Lib/utils/result";
import {  IUserRepository, PeerCounsellorData } from "@Repositories/User.repository";

export class GetPeerCounsellor {
    constructor(
      private readonly repo: IUserRepository,
      private readonly config: any
    ) {}
    async fetch(
      id:string
    ): Promise<
      | ResultPayload<PeerCounsellorData>
      | ResultPayload<Error>
      | undefined
    > {
      try {
        const result = await this.repo.getPeerCounsellor(id);
        return new ResultPayload<PeerCounsellorData>(
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