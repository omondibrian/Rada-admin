import { IUser } from "@Models/User.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { PasswordReset } from "@Rada/src/usecases/PasswordReset";
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
  
  describe("ForgotPass - Usecase", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    const testRepo = new UserMockRepository();
    const generate = jest.fn().mockReturnValue("testPass");
    const config = jest.fn().mockReturnValue({ env: "development" });
  
    const bcrypt = new Bcrypt();
    const usecase = new PasswordReset(testRepo, generate, bcrypt, config);
    const user :IUser = {
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
    const userCredentials = {
      newPassword: "testPass",
      email: "testUser@email.com",
    };
    it("should successfully reset user's password", async () => {
      // setup mocks
      const mockFindUser = jest
        .spyOn(testRepo, "find")
        .mockResolvedValue(user as IUser);
      const mockUpdate = jest
        .spyOn(testRepo, "update")
        .mockResolvedValue(user as IUser);
      const mockBcrypt = jest
        .spyOn(bcrypt, "hash")
        .mockReturnValue(userCredentials.newPassword);
      const result = await usecase.reset(userCredentials);
  
      expect(testRepo.find).toHaveBeenCalledTimes(1);
      expect(testRepo.update).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(generate).toReturnWith("testPass");
      expect(result).toStrictEqual<ResultPayload<{ message: string }>>(
        new ResultPayload(
          {
            message: "Password Reset was successfull,please check your email",
          },
          200
        )
      );
      mockUpdate.mockClear();
      mockFindUser.mockClear();
      mockBcrypt.mockClear();
    });
  
    it("should return error message if invalid email is passed", async () => {
      const mockFindUser = jest
        .spyOn(testRepo, "find")
        .mockReturnValue(Promise.resolve(undefined));
  
      const result = (await usecase.reset(
        userCredentials
      )) as ResultPayload<Error>;
      expect(result.getError()?.message).toEqual(
        "Invalid Email please try again !"
      );
      mockFindUser.mockClear();
    });
  
    it("should return error message if profile update fails", async () => {
      // setup mocks
      const mockFindUser = jest
        .spyOn(testRepo, "find")
        .mockResolvedValue(user as IUser);
      const mockUpdate = jest
        .spyOn(testRepo, "update")
        .mockReturnValue(Promise.resolve(undefined as unknown as IUser));
  
      const result = (await usecase.reset(
        userCredentials
      )) as ResultPayload<Error>;
      expect(result.getError()?.message).toEqual(
        "Unable to Finish The Operation"
      );
      mockUpdate.mockClear();
    });
  
    it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
      const mockFindUser = jest.spyOn(testRepo, "find").mockImplementation(() => {
        throw new Error("Error will Testing");
      });
      config.mockReturnValue({ env: "development" });
      const result = (await usecase.reset(
        userCredentials
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
      const mockFindUser = jest.spyOn(testRepo, "find").mockImplementation(() => {
        throw new Error("Error will Testing");
      });
      config.mockReturnValue({ env: "production" });
      const result = (await usecase.reset(
        userCredentials
      )) as ResultPayload<Error>;
  
      const expectedSimulatedResults = new ResultPayload<Error>(
        new Error("unable to reset password at the moment please try again"),
        500
      );
      expect(result?.getError()?.message).toBe(
        "unable to reset password at the moment please try again"
      );
      expect(result).toStrictEqual<ResultPayload<Error>>(
        expectedSimulatedResults
      );
      mockFindUser.mockClear();
    });
  });