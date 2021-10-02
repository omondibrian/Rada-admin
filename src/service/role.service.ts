import { AdminRoleRepository } from '@Rada/src/Repositories/Role.repository';
import { AssignUserRole } from '../usecases/AssignUserRole';
import { FetchUserRole } from '../usecases/FetchUserRole';
import { RemoveRole } from '../usecases/RemoveRole';
import { RemoveUserRole } from '../usecases/RemoveUserRole';
import { AddRole } from './../usecases/AddRole';
export class RoleServiceProvider {
    private readonly repo = new AdminRoleRepository();
    private config() {
        return {
          env: process.env.NODE_ENV,
          multiTenantMode: process.env.MODE === "true" ? true : false,
        };
      }
    addRole = new AddRole(this.repo,this.config)
    assingUserRole = new AssignUserRole(this.repo,this.config) 
    fetchUserRole = new FetchUserRole(this.repo,this.config)
    removeUserRole = new RemoveUserRole(this.repo,this.config)
    removeRole = new RemoveRole(this.repo,this.config);
    
}