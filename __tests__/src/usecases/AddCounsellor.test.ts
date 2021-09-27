import { ICounsellor } from "@Models/counsellor.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { AddCounsellor } from "@Rada/src/usecases/AddCounsellor";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";

describe("Add new Counsellor - Usecase", () => {
    const repo = new UserMockRepository();
    const config = jest.fn().mockReturnValue({ env: "development" });
    const usecase = new AddCounsellor(repo, config);
    const counsellor: ICounsellor = {
      User_id: 1,
      expertise: "test expertise",
      Campuses_id: 1,
      Schedule:[]
    };
    it("should successfully add the new user as a counsellor", async () => {
      const mockAddCounsellor = jest
        .spyOn(repo, "addCounsellor")
        .mockResolvedValue(true);
      const result = await usecase.add(counsellor);
      expect(result).toBeDefined();
      expect(repo.addCounsellor).toHaveBeenCalledTimes(1);
      mockAddCounsellor.mockClear();
    });
    it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
      const mockAddCounsellor = jest
        .spyOn(repo, "addCounsellor")
        .mockImplementation(() => {
          throw new Error("Error will Testing");
        });
      config.mockReturnValue({ env: "development" });
      const result = (await usecase.add(counsellor)) as ResultPayload<Error>;
  
      const expectedSimulatedResults = new ResultPayload<Error>(
        new Error("Error will Testing"),
        500
      );
      expect(result?.getError()?.message).toBe("Error will Testing");
      expect(result).toStrictEqual<ResultPayload<Error>>(
        expectedSimulatedResults
      );
      mockAddCounsellor.mockClear();
    });
  
    it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
      const mockAddCounsellor = jest
        .spyOn(repo, "addCounsellor")
        .mockImplementation(() => {
          throw new Error("Error will Testing");
        });
      config.mockReturnValue({ env: "production" });
      const result = (await usecase.add(counsellor)) as ResultPayload<Error>;
  
      const expectedSimulatedResults = new ResultPayload<Error>(
        new Error("Unable to add new Counsellor.Please retry"),
        500
      );
      expect(result?.getError()?.message).toBe(
        "Unable to add new Counsellor.Please retry"
      );
      expect(result).toStrictEqual<ResultPayload<Error>>(
        expectedSimulatedResults
      );
      mockAddCounsellor.mockClear();
    });
  });
  