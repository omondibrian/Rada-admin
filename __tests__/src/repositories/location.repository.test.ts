import { config } from "dotenv";
import {
  ILocation,
  LocationRepository,
} from "@Repositories/location.repository";

config();

describe("Location Repository ", () => {
  const repository = new LocationRepository();
  const testLocation: ILocation = {
    University_id: "1",
    Campuses_id: "1",
    latitude: "-0.329 ",
    longitude: "35.944",
  };
  let locationId = "0";
  describe("LocationRepository - addLocation ", () => {
    it("should successfully add a new location for a paricular university", async () => {
      const result = await repository.addLocation(testLocation);
      locationId = result._id as string;
      expect(result.latitude).toEqual(testLocation.latitude);
      expect(result.longitude).toEqual(testLocation.longitude);
      expect(result.University_id).toEqual(testLocation.University_id);
    });
  });

  describe("LocationRepository - fetchLocation", () => {
    it("should fetch a list of location co-ordinates for a particuar university", async () => {
      const uniId = "1";
      const result = await repository.fetchLocation(uniId);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("LocationRepository - removeLocation", () => {
    it("should remove the specified location", async () => {
      const result = await repository.removeLocation(locationId);
      expect(result.latitude).toEqual(testLocation.latitude);
      expect(result.longitude).toEqual(testLocation.longitude);
      expect(result.University_id).toEqual(testLocation.University_id);
    });
  });
});
