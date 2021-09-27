import { ICounsellor } from "@Models/counsellor.model";
import { IPeerCounsellor } from "@Models/peerCounsellor.model";
import { IUserRepository } from "@Repositories/User.repository";
import { ResultPayload } from "../Lib/utils/result";

export class UpdateCounsellorOrPeerCounsellor {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async update(
    user: ICounsellor | IPeerCounsellor,
    userId: string
  ): Promise<
    | ResultPayload<{ msg: string; isUpdated: boolean }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.updateCounselorOrPeerCounsellor(user, {
        field: "_id",
        value: userId,
      });
      return new ResultPayload<{ msg: string; isUpdated: boolean }>(
        { msg: "Succesfully updated Counsellor Details", isUpdated: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to update Counsellor details .Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
