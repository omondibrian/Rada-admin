import { ResultPayload } from "../Lib/utils/result";

import {
  ILocation,
  ILocationRepository,
} from "@Repositories/location.repository";

export class FetchLocation {
  constructor(
    private readonly repo: ILocationRepository,
    private readonly config: any
  ) {}
  async fetch(
    id: string
  ): Promise<
    ResultPayload<Array<ILocation>> | ResultPayload<Error> | undefined
  > {
    try {
      const result = await this.repo.fetchLocation(id);
      return new ResultPayload<Array<ILocation>>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to retrive campus location";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
