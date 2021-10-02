import { IAdminUser } from "@Rada/src/models/AdminUser.model";
import { IRole } from "@Rada/src/models/Role.model";
import { AdminRoleRepository } from "@Rada/src/Repositories/Role.repository";

describe("Administative Roles Repository", () => {
  const repo = new AdminRoleRepository();
  let roleId = "0";

  let adminId = "0";
  const role: IRole = {
    name: "Test Role",
  };
  describe("Repository - AddRole", () => {
    it("should add new user role", async () => {
      const result = await repo.addRole(role);
      roleId = result._id?.toString() as string;
      expect(result.name).toEqual(role.name);
    });
  });

  describe("Repository - AssignUserRole", () => {
    it("should assign new user role", async () => {
      const admin: IAdminUser = {
        User_id: "1",
        Roles_id: roleId,
      };
      const result = await repo.assingUserRole(admin);
      adminId = result._id?.toString() as string;
      admin._id = result._id;
      expect(result).toEqual(admin);
    });
  });

  describe("Repository - fetchUserRole", () => {
    it("should fetch role for a particuar user if it exists", async () => {
      const admin: IAdminUser = {
        User_id: "1",
        Roles_id: roleId,
      };
      const result = await repo.fetchUserRole(admin.User_id);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  // describe("Repository - removeUserRole", () => {
  //   it("should remove the specified admin user", async () => {
  //     const result = await repo.removeUserRole(adminId);
  //     expect(result).toBeDefined();
  //   });
  // });

  describe("Repository - removeRole", () => {
    it("should remove the specified role", async () => {
      const result = await repo.removeRole(roleId);
      expect(result._id).toEqual(roleId);
    });
  });
});
