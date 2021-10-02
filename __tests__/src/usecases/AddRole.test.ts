import { MockRole } from "@Rada/__mocks__/roles";
import { AddRole } from "@Rada/src/usecases/AddRole";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IRole } from "@Rada/src/models/Role.model";

describe("Add new Administartive role - Usecase", () => {
  const repo = new MockRole();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AddRole(repo, config);
  const role: IRole = {
    name: "test Role",
  };
  it("should successfully add new role", async () => {
    const mockAddRole = jest.spyOn(repo, "addRole").mockResolvedValue(role);
    const result = await usecase.add(role);
    expect(result).toBeDefined();
    expect(repo.addRole).toHaveBeenCalledTimes(1);
    mockAddRole.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddRole = jest.spyOn(repo, "addRole").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(role)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddRole.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddRole = jest.spyOn(repo, "addRole").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(role)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add new Role"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new Role"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddRole.mockClear();
  });
});
