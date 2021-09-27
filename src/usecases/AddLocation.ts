import { ResultPayload } from "../Lib/utils/result";

import {
  ILocation,
  ILocationRepository,
} from "@Repositories/location.repository";

export class AddLocation {
  constructor(
    private readonly repo: ILocationRepository,
    private readonly config: any
  ) {}
  async add(
    location: ILocation
  ): Promise<ResultPayload<ILocation> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.addLocation(location);
      return new ResultPayload<ILocation>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new campus location";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
