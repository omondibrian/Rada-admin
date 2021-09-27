import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { DeleteCounsellorOrPeerCounsellor } from "@Rada/src/usecases/DeleteCounsellorOrPeerCounsellor";

describe("Delete Counsellor or Peer Counsellor Details - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new DeleteCounsellorOrPeerCounsellor(repo, config);

  const counsellorId = "1";
  const peerCounsellorId = "1";

  it("should successfully delete Counsellor details", async () => {
    const mockdeleteCounsellorOrPeerCounsellor = jest
      .spyOn(repo, "deleteCounselorOrPeerCounsellor")
      .mockResolvedValue(true);
    const result = await usecase.remove(counsellorId, false);
    expect(result).toBeDefined();
    expect(repo.deleteCounselorOrPeerCounsellor).toHaveBeenCalledTimes(1);
    mockdeleteCounsellorOrPeerCounsellor.mockClear();
  });

  it("should successfully update Peer Counsellor details", async () => {
    const mockdeleteCounsellorOrPeerCounsellor = jest
      .spyOn(repo, "deleteCounselorOrPeerCounsellor")
      .mockResolvedValue(true);
    const result = await usecase.remove(peerCounsellorId, true);
    expect(result).toBeDefined();
    expect(repo.deleteCounselorOrPeerCounsellor).toHaveBeenCalledTimes(1);
    mockdeleteCounsellorOrPeerCounsellor.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockdeleteCounsellorOrPeerCounsellor = jest
      .spyOn(repo, "deleteCounselorOrPeerCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });

    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(
      counsellorId,
      false
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockdeleteCounsellorOrPeerCounsellor.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockdeleteCounsellorOrPeerCounsellor = jest
      .spyOn(repo, "deleteCounselorOrPeerCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(
      peerCounsellorId,
      true
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove Counsellor details .Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove Counsellor details .Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockdeleteCounsellorOrPeerCounsellor.mockClear();
  });
});
