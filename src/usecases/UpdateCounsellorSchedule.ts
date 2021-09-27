import { ResultPayload } from "../Lib/utils/result";
import { ISchedule } from "@Models/counsellor.model";
import { IUserRepository } from "@Repositories/User.repository";

export class UpdateCounsellorSchedule {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async update(
    user: Array<ISchedule>,
    userId: string
  ): Promise<
    | ResultPayload<{ msg: string; isUpdated: boolean }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.updateCounsellorSchedule(user, userId);
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
