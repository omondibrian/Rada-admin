import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { FetchUserMetrics } from "@Rada/src/usecases/FetchUserMetrics";

describe("Fetch User Metrics - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchUserMetrics(repo, config);

  it("should successfully retrive user metrics", async () => {
    const mockFetchUserMetrics = jest
      .spyOn(repo, "fetchUserMetrics")
      .mockResolvedValue({
        analytics: {
          totalNoMaleUsers: 1,
          totalNoFemaleUsers: 1,
          totalNoCounsellors: 1,
          totalNoPeerCounsellors: 1,
          totalNoUsers: 2,
        },
      });
    const result = await usecase.fetch();
    expect(result).toBeDefined();
    expect(repo.fetchUserMetrics).toHaveBeenCalledTimes(1);
    mockFetchUserMetrics.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchUserMetrics = jest
      .spyOn(repo, "fetchUserMetrics")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch()) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchUserMetrics.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchUserMetrics = jest
      .spyOn(repo, "fetchUserMetrics")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch()) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive metrics Data .Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive metrics Data .Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchUserMetrics.mockClear();
  });
});
