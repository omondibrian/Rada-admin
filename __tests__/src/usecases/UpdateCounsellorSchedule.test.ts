import { ISchedule } from "@Models/counsellor.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { UpdateCounsellorSchedule } from "@Rada/src/usecases/UpdateCounsellorSchedule";

describe("Update Counsellor Schedule - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new UpdateCounsellorSchedule(repo, config);

  const counsellorData:Array<ISchedule> =  [
    {
      day: "MON",
      active: {
        from: "0800h",
        to: "1600h",
      },
    },
    {
      day: "TUE",
      active: {
        from: "0800h",
        to: "1600h",
      },
    },
  ]


  it("should successfully update Counsellor Schedule", async () => {
    const mockUpdate = jest
      .spyOn(repo, "updateCounsellorSchedule")
      .mockResolvedValue(true);
    const result = await usecase.update(counsellorData,'1');
    expect(result).toBeDefined();
    expect(repo.updateCounsellorSchedule).toHaveBeenCalledTimes(1);
    mockUpdate.mockClear();
  });


  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockupdateCounsellorSchedule = jest
      .spyOn(repo, "updateCounsellorSchedule")
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
    mockupdateCounsellorSchedule.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockupdateCounsellorSchedule = jest
      .spyOn(repo, "updateCounsellorSchedule")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.update(counsellorData,'1')) as ResultPayload<Error>;

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
    mockupdateCounsellorSchedule.mockClear();
  });
});
