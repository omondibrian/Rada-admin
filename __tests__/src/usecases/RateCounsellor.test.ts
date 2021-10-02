import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { RateCounsellor } from "./../../../src/usecases/RateCounsellor";

describe("Rate Counsellor - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new RateCounsellor(repo, config);
  const counsellorId = "1";
  const rating = {
    currentRating: 5,
  };
  const rate = 5;
  it("should successfully rate the specified counsellor", async () => {
    const mockRateCounsellor = jest
      .spyOn(repo, "rateCounsellor")
      .mockResolvedValue(rating);
    const result = await usecase.rate(counsellorId, rate);
    expect(result).toBeDefined();
    expect(repo.rateCounsellor).toHaveBeenCalledTimes(1);
    mockRateCounsellor.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRateCounsellor = jest
      .spyOn(repo, "rateCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.rate(
      counsellorId,
      rate
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRateCounsellor.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockRateCounsellor = jest
      .spyOn(repo, "rateCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.rate(
      counsellorId,
      rate
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to rate Counsellor.Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to rate Counsellor.Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRateCounsellor.mockClear();
  });
});
