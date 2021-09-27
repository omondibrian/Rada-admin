import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { FetchCampus } from "@Rada/src/usecases/FetchCampus";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";

describe("Fetch campus- Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchCampus(repo, config);
  const universityId = "1";
  it("should successfully retrive awailable campus(es)  for a particular institution", async () => {
    const mockFetchCampus = jest
      .spyOn(repo, "fetchCampus")
      .mockResolvedValue([]);
    const result = await usecase.fetch(universityId);
    expect(result).toBeDefined();
    expect(repo.fetchCampus).toHaveBeenCalledTimes(1);
    mockFetchCampus.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchCampus = jest
      .spyOn(repo, "fetchCampus")
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
    mockFetchCampus.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchCampus = jest
      .spyOn(repo, "fetchCampus")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive Avaliable Campus(es) . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive Avaliable Campus(es) . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchCampus.mockClear();
  });
});
