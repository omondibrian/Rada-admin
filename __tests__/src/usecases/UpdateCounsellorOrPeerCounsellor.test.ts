import { ICounsellor } from "@Models/counsellor.model";
import { IPeerCounsellor } from "@Models/peerCounsellor.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { UpdateCounsellorOrPeerCounsellor } from "@Rada/src/usecases/UpdateCounsellorOrPeerCounsellor";

describe("Update Counsellor or Peer Counsellor Details - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new UpdateCounsellorOrPeerCounsellor(repo, config);

  const counsellorData: ICounsellor = {
    expertise: "HIV/AIDS",
    User_id: 1,
    Campuses_id: 1,
    Schedule: [
      {
        day: "MON",
        active: {
          from: "0800h",
          to: "1600h",
        },
      },
    ],
  };
  const peerCounsellor: IPeerCounsellor = {
    Campuses_id: 1,
    Student_id: 1,
    User_id: 1,
    expertise: "Alcohol&SubstanceAbuse",
  };

  it("should successfully update Counsellor details", async () => {
    const mockUpdate = jest
      .spyOn(repo, "updateCounselorOrPeerCounsellor")
      .mockResolvedValue(true);
    const result = await usecase.update(counsellorData,'1');
    expect(result).toBeDefined();
    expect(repo.updateCounselorOrPeerCounsellor).toHaveBeenCalledTimes(1);
    mockUpdate.mockClear();
  });

  it("should successfully update Peer Counsellor details", async () => {
    const mockUpdate = jest
      .spyOn(repo, "updateCounselorOrPeerCounsellor")
      .mockResolvedValue(true);
    const result = await usecase.update(peerCounsellor,'1');
    expect(result).toBeDefined();
    expect(repo.updateCounselorOrPeerCounsellor).toHaveBeenCalledTimes(1);
    mockUpdate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockupdateCounselorOrPeerCounsellor = jest
      .spyOn(repo, "updateCounselorOrPeerCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.update(counsellorData,'1')) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockupdateCounselorOrPeerCounsellor.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockupdateCounselorOrPeerCounsellor = jest
      .spyOn(repo, "updateCounselorOrPeerCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.update(peerCounsellor,'1')) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to update Counsellor details .Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to update Counsellor details .Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockupdateCounselorOrPeerCounsellor.mockClear();
  });
});
