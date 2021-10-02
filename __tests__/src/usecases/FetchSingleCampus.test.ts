import { ICampus } from "@Rada/src/models/Campus.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";
import { FetchSingleCampus } from "@Rada/src/usecases/FetchSingleCampus";

describe("Fetch Single Campus - Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchSingleCampus(repo, config);
  const campus: ICampus = {
    name: "test Campus",
    University_id: "1",
  };
  it("should successfully fetch all campus details", async () => {
    const mockFetchCampus = jest
      .spyOn(repo, "fetchCampusByName")
      .mockResolvedValue(campus);

    const result = await usecase.fetch(campus.name);

    expect(result).toBeDefined();
    expect(repo.fetchCampusByName).toHaveBeenCalledTimes(1);

    mockFetchCampus.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchCampus = jest
      .spyOn(repo, "fetchCampusByName")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(campus.name)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchCampus.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchCampus = jest
      .spyOn(repo, "fetchCampusByName")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(campus.name)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive  the requested campus . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive  the requested campus . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchCampus.mockClear();
  });
});
