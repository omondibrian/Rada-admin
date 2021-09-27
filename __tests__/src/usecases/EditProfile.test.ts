import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IUser } from "@Rada/src/models/User.model";
import { EditProfile } from "@Rada/src/usecases/EditProfile";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";

class Bcrypt {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  public compare() {
    return true;
  }
  public hash(pass: string) {
    return `pass${pass}`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public genSalt(): any {}
}

describe("EditProfile - Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRepo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const bcrypt = new Bcrypt();
  const usecase = new EditProfile(testRepo, bcrypt, config);
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
  };
  const newUserProfile: IUser = {
    name: "Updatedtest",
    email: "newtestUser@test.com",
    phone: "13011998",
    joined: "12/01/1234",
    password: "test",
    status: "online",
    account_status: "active",
    profilePic: "./updatedPicture.jpg",
    dob: "31-12-2024",
    synced: "true",
    gender: "male",
  };
  const userId = "1";
  it("should successfully Edit User Profile password changed", async () => {
    // setup mocks
    const mockUpdate = jest
      .spyOn(testRepo, "update")
      .mockResolvedValue(newUserProfile as IUser);
    const mockBcrypt = jest
      .spyOn(bcrypt, "hash")
      .mockReturnValue(user.password as string);
    const result = await usecase.update(userId, newUserProfile);

    expect(testRepo.update).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    mockUpdate.mockClear();
    mockBcrypt.mockClear();
  });

  it("should successfully Edit User Profile - password not changed", async () => {
    const newUserProfile: Partial<IUser> = {
        name: "Updatedtest",
        email: "newtestUser@test.com",
        phone: "13011998",
        joined: "12/01/1234",
        status: "online",
        account_status: "active",
        profilePic: "./updatedPicture.jpg",
        dob: "31-12-2024",
        synced: "true",
        gender: "male",
      };
    // setup mocks
    const mockUpdate = jest
      .spyOn(testRepo, "update")
      .mockResolvedValue(newUserProfile as IUser);

    const result = await usecase.update(userId, newUserProfile);

    expect(testRepo.update).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    mockUpdate.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "update")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.update(
      userId,
      newUserProfile
    )) as ResultPayload<Error>;

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
      .spyOn(testRepo, "update")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.update(
      userId,
      newUserProfile
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to update Profile"),
      500
    );
    expect(result?.getError()?.message).toBe("Unable to update Profile");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFindUser.mockClear();
  });
});
