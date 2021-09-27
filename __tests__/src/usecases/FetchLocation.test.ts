import { MockLocation } from "@Rada/__mocks__/location";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { ILocation } from "@Repositories/location.repository";
import { FetchLocation } from "@Rada/src/usecases/FetchLocation";

describe("Fetch Location  - Usecase", () => {
  const repo = new MockLocation();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchLocation(repo, config);
  const location: ILocation = {
    longitude: "1",
    latitude: "-0.345",
    University_id: "1",
    Campuses_id: "1",
  };
  const universityId = "1";

  it("should successfully retrive campusLocations for particular university", async () => {
    const mockFetchLocation = jest
      .spyOn(repo, "fetchLocation")
      .mockResolvedValue([location]);
    const result = await usecase.fetch(universityId);
    expect(result).toBeDefined();
    expect(repo.fetchLocation).toHaveBeenCalledTimes(1);
    mockFetchLocation.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchLocation = jest
      .spyOn(repo, "fetchLocation")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchLocation.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchLocation = jest
      .spyOn(repo, "fetchLocation")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive campus location"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive campus location"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchLocation.mockClear();
  });
});
