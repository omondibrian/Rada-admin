import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { CounsellorData } from "@Repositories/User.repository";
import { GetCounsellor } from "@Rada/src/usecases/GetCounsellor";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";

describe("Get Counsellor - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new GetCounsellor(repo, config);
  const counsellorId = "1";
  const counsellor: CounsellorData = {
    User_id: 1,
    expertise: "test expertise",
    Campuses_id: 1,
    Schedule:[],
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
    University_id:'1',
    rating:5
  };
  it("should successfully retrive the requested counsellor", async () => {
    const mockFetchCounsellor = jest
      .spyOn(repo, "getCounsellor")
      .mockResolvedValue(counsellor);
    const result = await usecase.fetch(counsellorId);
    expect(result).toBeDefined();
    expect(repo.getCounsellor).toHaveBeenCalledTimes(1);
    mockFetchCounsellor.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchCounsellor = jest
      .spyOn(repo, "getCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(counsellorId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchCounsellor.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchCounsellor = jest
      .spyOn(repo, "getCounsellor")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(counsellorId)) as ResultPayload<Error>;

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
    mockFetchCounsellor.mockClear();
  });
});
