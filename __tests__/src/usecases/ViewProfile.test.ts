import { IUser } from "@Models/User.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { ViewProfile } from "@Rada/src/usecases/ViewProfile";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";

describe("ViewProfile - Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRepo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new ViewProfile(testRepo, config);
  const user: IUser = {
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

  const userId = "1";
  it("should successfully Retrive User Profile", async () => {
    // setup mocks
    const mockUpdate = jest
      .spyOn(testRepo, "findById")
      .mockResolvedValue(user as IUser);

    const result = await usecase.profile(userId);

    expect(testRepo.findById).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    mockUpdate.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "findById")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.profile(userId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFindUser.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "findById")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.profile(userId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to fetch Profile"),
      500
    );
    expect(result?.getError()?.message).toBe("Unable to fetch Profile");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFindUser.mockClear();
  });
});
