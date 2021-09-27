import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IPeerCounsellor } from "@Models/peerCounsellor.model";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { AddPeerCounsellor } from "@Rada/src/usecases/AddPeerCounsellor";

describe("Add new Peer Counsellor - Usecase", () => {
    const repo = new UserMockRepository();
    const config = jest.fn().mockReturnValue({ env: "development" });
    const usecase = new AddPeerCounsellor(repo, config);
    const counsellor: IPeerCounsellor = {
      User_id: 1,
      expertise: "test expertise",
      Campuses_id: 1,
      Student_id:1
    };
    it("should successfully add the user as a peer counsellor", async () => {
      const mockAddPeerCounsellor = jest
        .spyOn(repo, "addPeerCounsellor")
        .mockResolvedValue(true);
      const result = await usecase.add(counsellor);
      expect(result).toBeDefined();
      expect(repo.addPeerCounsellor).toHaveBeenCalledTimes(1);
      mockAddPeerCounsellor.mockClear();
    });
    it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
      const mockAddPeerCounsellor = jest
        .spyOn(repo, "addPeerCounsellor")
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
      mockAddPeerCounsellor.mockClear();
    });
  
    it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
      const mockAddPeerCounsellor = jest
        .spyOn(repo, "addPeerCounsellor")
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
      mockAddPeerCounsellor.mockClear();
    });
  });
  