import { MockLocation } from "@Rada/__mocks__/location";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { AddLocation } from "@Rada/src/usecases/AddLocation";
import { ILocation } from "@Repositories/location.repository";

describe("Add new Location  - Usecase", () => {
  const repo = new MockLocation();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AddLocation(repo, config);
  const location: ILocation = {
    longitude: "1",
    latitude: "-0.345",
    University_id: "1",
    Campuses_id: "1",
  };

  it("should successfully add the new campusLocation", async () => {
    const mockAddLocation = jest
      .spyOn(repo, "addLocation")
      .mockResolvedValue(location);
    const result = await usecase.add(location);
    expect(result).toBeDefined();
    expect(repo.addLocation).toHaveBeenCalledTimes(1);
    mockAddLocation.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddLocation = jest
      .spyOn(repo, "addLocation")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(location)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddLocation.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddLocation = jest
      .spyOn(repo, "addLocation")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(location)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add new campus location"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new campus location"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddLocation.mockClear();
  });
});
