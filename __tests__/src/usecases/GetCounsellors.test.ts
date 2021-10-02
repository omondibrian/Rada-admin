import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { GetCounsellors } from "@Rada/src/usecases/GetCounsellors";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";

describe("Get Counsellors - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new GetCounsellors(repo, config);
  const universityId = '1';
  it("should successfully retrive all available counsellors", async () => {
    const mockFetchCounsellors = jest
      .spyOn(repo, "getCounsellors")
      .mockResolvedValue([]);
    const result = await usecase.fetch(universityId);
    expect(result).toBeDefined();
    expect(repo.getCounsellors).toHaveBeenCalledTimes(1);
    mockFetchCounsellors.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchCounsellors = jest
      .spyOn(repo, "getCounsellors")
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
    mockFetchCounsellors.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchCounsellors = jest
      .spyOn(repo, "getCounsellors")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive current Counsellors.Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive current Counsellors.Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchCounsellors.mockClear();
  });
});
