import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { PeerCounsellorData } from "@Repositories/User.repository";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { GetPeerCounsellor } from "@Rada/src/usecases/GetPeerCounsellor";

describe("Get Peer Counsellor - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new GetPeerCounsellor(repo, config);
  const peerCounsellorId = "1";
  const peerCounsellor: PeerCounsellorData = {
    User_id: 1,
    expertise: "test expertise",
    Campuses_id: 1,
    Student_id: 1,
    regNo: "S13/098666/12",
    name: "testUser",
    email: "testUser1@test.com",
    password: "test",
    profilePic: "./updatedPic.jpg",
    gender: "other",
    phone: "13011999",
    dob: "31-12-2023",
    status: "online",
    account_status: "active",
    synced: "true",
    joined: "12/01/1234",
    University_id:'1'
  };
  it("should successfully retrive the requested Peer counsellor", async () => {
    const mockFetchPeerCounsellor = jest
      .spyOn(repo, "getPeerCounsellor")
      .mockResolvedValue(peerCounsellor);
    const result = await usecase.fetch(peerCounsellorId);
    expect(result).toBeDefined();
    expect(repo.getPeerCounsellor).toHaveBeenCalledTimes(1);
    mockFetchPeerCounsellor.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchPeerCounsellor = jest
      .spyOn(repo, "getPeerCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(
      peerCounsellorId
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchPeerCounsellor.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchPeerCounsellor = jest
      .spyOn(repo, "getPeerCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(
      peerCounsellorId
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive Counsellor.Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive Counsellor.Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchPeerCounsellor.mockClear();
  });
});
