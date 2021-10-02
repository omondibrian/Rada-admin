/**
 * @fileOverview contains the various functions to manage administartive roles.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IAdminUser } from "../models/AdminUser.model";
import { IRole } from "../models/Role.model";
import { DataBaseConnection } from "../Lib/db/connection";
import TableNames from "../Lib/constants";
export interface IAdminRoleRepository {
  addRole(role: IRole): Promise<IRole>;
  assingUserRole(admin: IAdminUser): Promise<IAdminUser>;
  fetchUserRole(id: string): Promise<Array<{ id: string; name: string }>>;
  removeUserRole(id: string): Promise<IAdminUser>;
  removeRole(id: string): Promise<IRole>;
}

export class AdminRoleRepository implements IAdminRoleRepository {
  private knexConn = new DataBaseConnection().getConnection();
  rolePayload = ["_id", "name"];
  adminPayload = [`${TableNames.Roles}.name`];
  adminRole = ["User_id", "Roles_id",'_id'];

  async addRole(role: IRole): Promise<IRole> {
    const [newRole] = await this.knexConn<IRole>(TableNames.Roles).insert(
      role,
      this.rolePayload
    );
    return newRole;
  }
  async assingUserRole(admin: IAdminUser): Promise<IAdminUser> {
    const [user] = await this.knexConn<IAdminUser>(
      TableNames.Admin_Users
    ).insert(admin, this.adminRole);
    return {
      User_id: user.User_id.toString(),
      Roles_id: user.Roles_id.toString(),
      _id:user._id
    };
  }
  async fetchUserRole(
    id: string
  ): Promise<Array<{ id: string; name: string }>> {
    const userRoles = await this.knexConn<IAdminUser>(TableNames.Admin_Users)
      .select(...this.adminPayload)
      .where("User_id", "=", id)
      .from(`${TableNames.Admin_Users}`)
      .join(TableNames.Roles, function () {
        this.on(
          `${TableNames.Admin_Users}.${TableNames.Roles}_id`,
          "=",
          `${TableNames.Roles}._id`
        );
      });
    return userRoles;
  }
  async removeUserRole(id: string): Promise<IAdminUser> {

    const [deletedUserRole] = await this.knexConn<IAdminUser>(
      TableNames.Admin_Users
    )
      .returning(["_id", "User_id", "Roles_id"])
      .where("_id", "=", id)
      .delete(["_id", "User_id", "Roles_id"]);
      console.log(deletedUserRole)

    return deletedUserRole as IAdminUser;
  }

  async removeRole(id: string): Promise<IRole> {
    const [deletedRole] = await this.knexConn<IRole>(TableNames.Roles)
      .returning(this.rolePayload)
      .where("_id", "=", id)
      .delete(this.rolePayload);
      
    return {
      _id: deletedRole._id.toString(),
      name: deletedRole.name,
    };
  }
}
