/**
 * @fileOverview contains the various functions to manage locations data.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TableNames from "../Lib/constants";
import { ICampus } from "@Models/Campus.model";
import { DataBaseConnection } from "../Lib/db/connection";

export interface ILocationRepository {
  addLocation(location: ILocation): Promise<ILocation>;
  fetchLocation(universityId: string): Promise<Array<ILocation>>;
  removeLocation(id: string): Promise<ILocation>;
}

export interface ILocation {
  _id?: string;
  longitude: string;
  latitude: string;
  University_id: string;
  Campuses_id: string;
  campus?: string;
}

export class LocationRepository implements ILocationRepository {
  private knexConn = new DataBaseConnection().getConnection();
  private locationPayload = [
    "_id",
    "longitude",
    "latitude",
    "Campuses_id",
    "University_id",
  ];
  private locationReturnPayload(newLocation: any): ILocation {
    return {
      _id: newLocation._id.toString(),
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      Campuses_id: newLocation.Campuses_id.toString(),
      campus: newLocation.campus,
      University_id: newLocation.University_id.toString(),
    };
  }
  private async addCampusData(newLocation: any) {
    const [campus] = await this.knexConn<ICampus>(TableNames.Campuses)
      .select("name")
      .where("_id", "=", newLocation.Campuses_id);
    newLocation.campus = campus.name;
  }

  async addLocation(location: ILocation): Promise<ILocation> {
    const [newLocation] = await this.knexConn<ILocation>(
      TableNames.Map_Locations
    ).insert(location, this.locationPayload);
    await this.addCampusData(newLocation);
    return this.locationReturnPayload(newLocation);
  }

  async fetchLocation(universityId: string): Promise<ILocation[]> {
    const locationCordinates = await this.knexConn<ILocation>(
      TableNames.Map_Locations
    )
      .select(...this.locationPayload)
      .where("University_id", "=", universityId);

    locationCordinates.map(
      async (location) => await this.addCampusData(location)
    );

    return locationCordinates.map((location) =>
      this.locationReturnPayload(location)
    );
  }

  async removeLocation(id: string): Promise<ILocation> {
    const [locationCordinate] = await this.knexConn<ILocation>(
      TableNames.Map_Locations
    )
      .returning(this.locationPayload)
      .where("_id", "=", id)
      .delete(this.locationPayload);
    await this.addCampusData(locationCordinate);
    return this.locationReturnPayload(locationCordinate);
  }
}
