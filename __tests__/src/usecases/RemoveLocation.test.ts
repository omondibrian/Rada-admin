import { MockLocation } from "@Rada/__mocks__/location";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { ILocation } from "@Repositories/location.repository";
import { RemoveLocation } from "@Rada/src/usecases/RemoveLocation";

describe("Remove Location  - Usecase", () => {
  const repo = new MockLocation();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new RemoveLocation(repo, config);
  const location: ILocation = {
    longitude: "1",
    latitude: "-0.345",
    University_id: "1",
    Campuses_id: "1",
  };
  const locationId = "1";

  it("should successfully remove the specified campusLocation for particular university", async () => {
    const mockRemoveLocation = jest
      .spyOn(repo, "removeLocation")
      .mockResolvedValue(location);
    const result = await usecase.remove(locationId);
    expect(result).toBeDefined();
    expect(repo.removeLocation).toHaveBeenCalledTimes(1);
    mockRemoveLocation.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRemoveLocation = jest
      .spyOn(repo, "removeLocation")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(locationId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemoveLocation.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockRemoveLocation = jest
      .spyOn(repo, "removeLocation")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(locationId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove campus location.Please retry in a moment"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove campus location.Please retry in a moment"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemoveLocation.mockClear();
  });
});
