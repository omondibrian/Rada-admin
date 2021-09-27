import { IAdminUser } from "@Models/AdminUser.model";
import { AddAdmin } from "@Rada/src/usecases/AddAdmin";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";

describe("Add new Administor - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AddAdmin(repo, config);
  const adminUser: IAdminUser = {
    User_id: "1",
    Roles_id: "1",
  };
  it("should successfully add the new user as an admin", async () => {
    const mockAddAdmin = jest.spyOn(repo, "addAdmin").mockResolvedValue(true);
    const result = await usecase.add(adminUser);
    expect(result).toBeDefined();
    expect(repo.addAdmin).toHaveBeenCalledTimes(1);
    mockAddAdmin.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddAdmin = jest.spyOn(repo, "addAdmin").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(adminUser)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddAdmin.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddAdmin = jest.spyOn(repo, "addAdmin").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(adminUser)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add user as Administrator"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add user as Administrator"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddAdmin.mockClear();
  });
});
