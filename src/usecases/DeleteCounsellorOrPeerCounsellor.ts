import { IUserRepository } from "@Repositories/User.repository";
import { ResultPayload } from "../Lib/utils/result";

export class DeleteCounsellorOrPeerCounsellor {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string,
    isPeer: boolean
  ): Promise<
    | ResultPayload<{ msg: string; isDeleted: boolean }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.deleteCounselorOrPeerCounsellor(
        id,
        isPeer
      );
      return new ResultPayload<{ msg: string; isDeleted: boolean }>(
        { msg: "Succesfully deleted Counsellor Details", isDeleted: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove Counsellor details .Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
