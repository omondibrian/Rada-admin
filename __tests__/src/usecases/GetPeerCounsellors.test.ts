import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { GetPeerCounsellors } from "@Rada/src/usecases/GetPeerCounsellors";

describe("Get Peer Counsellors - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new GetPeerCounsellors(repo, config);

  it("should successfully retrive the requested Peer counsellor", async () => {
    const mockFetchPeerCounsellors = jest
      .spyOn(repo, "getPeerCounsellors")
      .mockResolvedValue([]);
    const result = await usecase.fetch();
    expect(result).toBeDefined();
    expect(repo.getPeerCounsellors).toHaveBeenCalledTimes(1);
    mockFetchPeerCounsellors.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchPeerCounsellors = jest
      .spyOn(repo, "getPeerCounsellors")
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
    mockFetchPeerCounsellors.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchPeerCounsellors = jest
      .spyOn(repo, "getPeerCounsellors")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch()) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive Counsellors.Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive Counsellors.Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchPeerCounsellors.mockClear();
  });
});
