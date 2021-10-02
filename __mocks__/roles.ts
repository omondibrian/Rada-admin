import { IAdminUser } from "@Rada/src/models/AdminUser.model";
import { IRole } from "@Rada/src/models/Role.model";
import { IAdminRoleRepository } from "@Rada/src/Repositories/Role.repository";

export class MockRole implements IAdminRoleRepository{
    addRole(role: IRole): Promise<IRole> {
        throw new Error("Method not implemented.");
    }
    assingUserRole(admin: IAdminUser): Promise<IAdminUser> {
        throw new Error("Method not implemented.");
    }
    fetchUserRole(id: string): Promise<{ id: string; name: string; }[]> {
        throw new Error("Method not implemented.");
    }
    removeUserRole(id: string): Promise<IAdminUser> {
        throw new Error("Method not implemented.");
    }
    removeRole(id: string): Promise<IRole> {
        throw new Error("Method not implemented.");
    }
    
}