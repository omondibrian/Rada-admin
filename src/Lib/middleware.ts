/**
 * @fileOverview contains all the custom middleware used in the application
 * @author Brian Omondi
 * @version 0.0.1
 */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { RoleServiceProvider } from "../service/role.service";

export interface RequestModel extends Request {
  UserId: string;
}

const roleService = new RoleServiceProvider();

export const TokenMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("ACCESS DENIED");

  try {
    const verifiedToken: any = jwt.verify(
      token,
      process.env.SECREATE_TOKEN as string
    );
    req.UserId = verifiedToken._id as string;
    req.universityId = verifiedToken.uId as string;

    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userRole = await roleService.fetchUserRole.fetch(req.UserId);
    const roles = userRole!.getResult().payload as {
      msg: string;
      role: { name: string; id: string }[];
    };
    let pass = false;
    roles.role.forEach((role) => {
      if (role.name === "ADMIN") pass = true;
    });
    if (pass) {
      next();
    } else {
      return res.status(403).send("forbiden operation");
    }
  } catch (error) {
    return res.status(403).send("Invalid credentials");
  }
};

export const isCounsellor = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = await roleService.fetchUserRole.fetch(req.UserId);
    const roles = userRole!.getResult().payload as {
      msg: string;
      role: { name: string; id: string }[];
    };
    let pass = false;
    roles.role.forEach((role) => {
      if (role.name === "COUNSELLOR") pass = true;
    });
    if (pass) {
      next();
    } else {
      return res.status(403).send("forbiden operation");
    }
  } catch (error) {
    return res.status(403).send("Invalid credentials");
  }
};

export const userValidation = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    university: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const userProfileValidation = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    password: Joi.string(),
    profilePic: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const counsellorValidation = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    expertise: Joi.string().required(),
    campus_id: Joi.string().required(),
    user_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const peerCounsellorValidation = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    expertise: Joi.string().required(),
    campus_id: Joi.string().required(),
    user_id: Joi.string().required(),
    student_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const counsellorScheduleValidation = (req: any, res: any, next: any) => {
  const scheduleSchema = Joi.object({
    day: Joi.string().required(),
    active: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }).required(),
  });
  const schema = Joi.object({
    schedule: Joi.array().items(scheduleSchema).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const universityRegistration = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    Country_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const campusOrFacultyRegistration = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    University_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const campusOrUniDeletion = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    isCampus: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const locationMiddleware = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
    campus_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const contentMiddleware = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    Data_types_id: Joi.string().required(),
    Sub_Categories_id: Joi.string().required(),
    Admin_Users_id: Joi.string().required(),
    content: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const contactMiddleware = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    campus_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};

export const adminMiddleware = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    User_id: Joi.string().required(),
    Role_id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).send(error);
  } else {
    next();
  }
};
