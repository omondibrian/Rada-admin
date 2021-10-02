import {
  adminMiddleware,
  counsellorScheduleValidation,
  counsellorValidation,
  isAdmin,
  isCounsellor,
  peerCounsellorValidation,
  userProfileValidation,
  userValidation,
} from "../Lib/middleware";
import { Router } from "express";
import { IUser } from "@Models/User.model";
import { ICampus } from "@Models/Campus.model";
import { IStudent } from "@Models/Student.model";
import { IAdminUser } from "@Models/AdminUser.model";
import { TokenMiddleware } from "./../Lib/middleware";
import { ICounsellor } from "@Models/counsellor.model";
import { UserServiceProvider } from "../service/User.service";
import { IPeerCounsellor } from "@Models/peerCounsellor.model";
import { addObjectToStore } from "../Lib/utils/addObjectToStore";
import { UniversityServiceProvider } from "../service/University.service";

const userRoutes = Router();
const userService = new UserServiceProvider();

userRoutes.get("/profile", TokenMiddleware, async (req: any, res, next) => {
  try {
    const user = await userService.fetchProfile.profile(req.UserId);
    res.status(user?.status as number).json({
      user: user?.getPayload(),
      message: user!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.get(
  "/studentprofile/:id",
  TokenMiddleware,
  isCounsellor,
  async (req: any, res, next) => {
    try {
      const user = await userService.fetchProfile.profile(req.params.id);
      res.status(user?.status as number).json({
        user: user?.getPayload(),
        message: user!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.get("/metrics", TokenMiddleware, async (req: any, res, next) => {
  try {
    const metrics = await userService.fetchUserMetrics.fetch();
    res.status(metrics?.status as number).json({
      metrics: metrics?.getPayload(),
      message: metrics!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.get("/counsellors", TokenMiddleware, async (req: any, res, next) => {
  try {
    const counsellors = await userService.fetchCounsellors.fetch(
      req.universityId
    );
    res.status(counsellors?.status as number).json({
      counsellors: counsellors?.getPayload(),
      message: counsellors!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.get(
  "/peercounsellors",
  TokenMiddleware,
  async (req: any, res, next) => {
    try {
      const counsellors = await userService.fetchPeerCounsellors.fetch(
        req.universityId
      );
      res.status(counsellors?.status as number).json({
        counsellors: counsellors?.getPayload(),
        message: counsellors!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.get(
  "/counsellor/:id",
  TokenMiddleware,
  async (req: any, res, next) => {
    try {
      const counsellor = await userService.fetchCounsellor.fetch(req.params.id);
      res.status(counsellor?.status as number).json({
        counsellor: counsellor?.getPayload(),
        message: counsellor?.getPayload()
          ? counsellor!.getResult().message
          : "counsellor not found",
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.get(
  "/peercounsellor/:id",
  TokenMiddleware,
  async (req: any, res, next) => {
    try {
      const counsellor = await userService.fetchPeerCounsellor.fetch(
        req.params.id
      );
      res.status(counsellor?.status as number).json({
        counsellor: counsellor?.getPayload(),
        message: counsellor?.getPayload()
          ? counsellor!.getResult().message
          : "counsellor not found",
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post(
  "/register",
  userValidation,
  addObjectToStore,
  async (req: any, res, next) => {
    const authorizationUrlFeedBack = {
      name: "John Doe",
      gender: "male",
      phone: "+25412345678",
      dob: "12/12/1111",
      regNo: "s12/04585/12",
      campus: "naks",
    };
    try {
      const userToRegister: IUser = {
        name: authorizationUrlFeedBack.name,
        email: req.body.email,
        password: req.body.password,
        profilePic: encodeURIComponent(req.name),
        gender: authorizationUrlFeedBack.gender,
        phone: authorizationUrlFeedBack.phone,
        dob: authorizationUrlFeedBack.dob,
        status: "online",
        account_status: "active",
        synced: "true",
        joined: Date.now().toString(),
        University_id: req.body.university,
      };

      const user = await userService.register.registeruser(userToRegister);
      if (!user?.isError() && authorizationUrlFeedBack.regNo) {
        const userPayload = user?.getResult().payload as any;
        const campus =
          await new UniversityServiceProvider().fetchCampusByName.fetch(
            authorizationUrlFeedBack.campus
          );
        const rez = campus?.getResult().payload as ICampus;
        console.log(campus);
        const student: IStudent = {
          Campuses_id: rez._id as number,
          User_id: userPayload.user._id,
          regNo: authorizationUrlFeedBack.regNo,
        };
        //add student details
        const result = await userService.addStudent.add(student);
      }
      res.status(user?.status as number).json({
        user: user!.getResult().payload,
        message: user!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post("/login", async (req: any, res, next) => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await userService.login.login(credentials);
    res.status(user?.status as number).json({
      token: user!.getResult().payload,
      message: user!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.post(
  "/admin",
  TokenMiddleware,
  isAdmin,
  adminMiddleware,
  async (req: any, res, next) => {
    try {
      const admin: IAdminUser = {
        User_id: req.body.User_id,
        Roles_id: req.body.Role_id,
      };
      const user = await userService.addAdministrator.add(admin);
      res.status(user?.status as number).json({
        payload: user!.getResult().payload,
        message: user!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post(
  "/counsellor/rate/:id",
  TokenMiddleware,
  async (req: any, res, next) => {
    try {
      const rating = await userService.rateCounsellor.rate(
        req.params.id,
        req.body.rate
      );
      res.status(rating?.status as number).json({
        counsellor: rating!.getResult().payload,
        message: rating!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post(
  "/counsellor",
  TokenMiddleware,
  counsellorValidation,
  async (req: any, res, next) => {
    try {
      const counsellor: ICounsellor = {
        Campuses_id: req.body.campus_id,
        User_id: req.body.user_id,
        expertise: req.body.expertise,
        Schedule: req.body.schedule || [],
      };
      const user = await userService.addCounsellor.add(counsellor);
      res.status(user?.status as number).json({
        counsellor: user!.getResult().payload,
        message: user!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post(
  "/peercounsellor",
  TokenMiddleware,
  peerCounsellorValidation,
  async (req: any, res, next) => {
    try {
      const counsellor: IPeerCounsellor = {
        Campuses_id: req.body.campus_id,
        User_id: req.body.user_id,
        expertise: req.body.expertise,
        Student_id: req.body.student_id,
      };
      const user = await userService.addPeerCounsellor.add(counsellor);
      res.status(user?.status as number).json({
        counsellor: user!.getResult().payload,
        message: user!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);
userRoutes.put(
  "/profile",
  TokenMiddleware,
  userProfileValidation,
  addObjectToStore,
  async (req: any, res, next) => {
    try {
      if (req.files) {
        req.body.profilePic = encodeURIComponent(req.name);
      }
      if (Object.keys(req.body).length !== 0) {
        const users = await userService.editProfile.update(
          req.UserId,
          req.body
        );
        res.status(users?.status as number).json({
          user: users!.getResult().payload,
          message: users!.getResult().message,
        });
      } else {
        res.status(302).json({
          message: "nothing to update",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.put(
  "/counsellor/schedule/",
  TokenMiddleware,
  isCounsellor,
  counsellorScheduleValidation,
  async (req: any, res, next) => {
    try {
      const schedule = await userService.updateCounsellorSchedule.update(
        req.body.schedule,
        req.UserId
      );
      res.status(schedule?.status as number).json({
        schedule: schedule?.getPayload(),
        message: schedule!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.put(
  "/counsellor/:id",
  TokenMiddleware,
  async (req: any, res, next) => {
    try {
      const users = await userService.updateCounsellorOrPeerCounsellor.update(
        req.body,
        req.params.id
      );
      res.status(users?.status as number).json({
        users: users?.getPayload(),
        message: users!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default userRoutes;
