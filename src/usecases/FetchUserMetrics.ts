import { ResultPayload } from "../Lib/utils/result";
import { IAnalytics, IUserRepository } from "@Repositories/User.repository";

export class FetchUserMetrics {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async fetch(): Promise<
    ResultPayload<IAnalytics> | ResultPayload<Error> | undefined
  > {
    try {
      const result = await this.repo.fetchUserMetrics();
      return new ResultPayload<IAnalytics>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to retrive metrics Data .Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
