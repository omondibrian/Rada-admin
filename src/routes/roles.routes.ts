import { Router } from "express";
import { isAdmin } from "../Lib/middleware";
import { IAdminUser } from "@Models/AdminUser.model";
import { RoleServiceProvider } from "../service/role.service";

const rolesRoute = Router();
const roleService = new RoleServiceProvider();

rolesRoute.post("/",isAdmin, async (req, res, next) => {
  try {
    const role = await roleService.addRole.add(req.body);
    res.status(role?.status as number).json({
      role: role!.getResult().payload,
      message: role!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

rolesRoute.post("/user",isAdmin, async (req:any, res, next) => {
  try {
    const user:IAdminUser = {
      Roles_id:req.body.roleId,
      User_id:req.body.userId
    }
    const userRole = await roleService.assingUserRole.add(user);
    res.status(userRole?.status as number).json({
      userRole: userRole!.getResult().payload,
      message: userRole!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

rolesRoute.get("/:id", async (req, res, next) => {
  try {
    const userRole = await roleService.fetchUserRole.fetch(req.params.id);
    res.status(userRole?.status as number).json({
      userRole: userRole!.getResult().payload,
      message: userRole!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

rolesRoute.delete("/user/:id",isAdmin, async (req, res, next) => {
  try {
    const userRole = await roleService.removeUserRole.remove(req.params.id);
    res.status(userRole?.status as number).json({
      userRole: userRole!.getResult().payload,
      message: userRole!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

rolesRoute.delete("/:id",isAdmin, async (req, res, next) => {
  try {
    const role = await roleService.removeRole.remove(req.params.id);
    res.status(role?.status as number).json({
      role: role!.getResult().payload,
      message: role!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

export default rolesRoute;
