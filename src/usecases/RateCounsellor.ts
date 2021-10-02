import { ResultPayload } from "../Lib/utils/result";
import { IUserRepository } from "@Repositories/User.repository";

export class RateCounsellor {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async rate(
    id: string,
    rating: number
  ): Promise<
    | ResultPayload<{
        currentRating: number;
      }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.rateCounsellor(id, rating);
      return new ResultPayload<{
        currentRating: number;
      }>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to rate Counsellor.Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
