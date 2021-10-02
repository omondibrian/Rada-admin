import { LocationRepository } from "@Repositories/location.repository";
import { AddLocation } from "../usecases/AddLocation";
import { FetchLocation } from "../usecases/FetchLocation";
import { RemoveLocation } from "../usecases/RemoveLocation";

export class LocationService {
  private readonly repo = new LocationRepository();
  private config() {
    return {
      env: process.env.NODE_ENV,
      multiTenantMode: process.env.MODE === "true" ? true : false,
    };
  }

  addLocation = new AddLocation(this.repo, this.config);
  fetchLocations = new FetchLocation(this.repo, this.config);
  deleteLocation = new RemoveLocation(this.repo, this.config);
}
