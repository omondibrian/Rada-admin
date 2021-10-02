import { MockRole } from "@Rada/__mocks__/roles";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { RemoveRole } from "@Rada/src/usecases/RemoveRole";
import { IRole } from "@Rada/src/models/Role.model";

describe("Remove  role - Usecase", () => {
  const repo = new MockRole();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new RemoveRole(repo, config);
  const role: IRole = {
    name: "test Role",
  };
  const roleId = "1";
  it("should successfully remove role", async () => {
    const mockRemoveRole = jest
      .spyOn(repo, "removeRole")
      .mockResolvedValue(role);
    const result = await usecase.remove(roleId);
    expect(result).toBeDefined();
    expect(repo.removeRole).toHaveBeenCalledTimes(1);
    mockRemoveRole.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRemoveRole = jest
      .spyOn(repo, "removeRole")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(roleId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemoveRole.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockRemoveRole = jest
      .spyOn(repo, "removeRole")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(roleId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove role .Please Retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove role .Please Retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemoveRole.mockClear();
  });
});
