import { ResultPayload } from "../Lib/utils/result";

import {
  ILocation,
  ILocationRepository,
} from "@Repositories/location.repository";

export class RemoveLocation {
  constructor(
    private readonly repo: ILocationRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string
  ): Promise<ResultPayload<ILocation> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.removeLocation(id);
      return new ResultPayload<ILocation>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove campus location.Please retry in a moment";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
