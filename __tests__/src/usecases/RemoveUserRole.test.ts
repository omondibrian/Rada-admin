import { MockRole } from "@Rada/__mocks__/roles";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IAdminUser } from "@Rada/src/models/AdminUser.model";
import { RemoveUserRole } from "@Rada/src/usecases/RemoveUserRole";

describe("Remove user role - Usecase", () => {
  const repo = new MockRole();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new RemoveUserRole(repo, config);
  const admin: IAdminUser = {
    User_id: "1",
    Roles_id: "1",
  };
  const userId = "1";
  it("should successfully remove user role", async () => {
    const mockRemoveRole = jest
      .spyOn(repo, "removeUserRole")
      .mockResolvedValue(admin);
    const result = await usecase.remove(userId);
    expect(result).toBeDefined();
    expect(repo.removeUserRole).toHaveBeenCalledTimes(1);
    mockRemoveRole.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRemoveRole = jest
      .spyOn(repo, "removeUserRole")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(userId)) as ResultPayload<Error>;

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
      .spyOn(repo, "removeUserRole")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(userId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove user's role or user has insufficient permissions"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove user's role or user has insufficient permissions"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemoveRole.mockClear();
  });
});
