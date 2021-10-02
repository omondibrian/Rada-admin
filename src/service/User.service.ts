import { UpdateCounsellorOrPeerCounsellor } from "./../usecases/UpdateCounsellorOrPeerCounsellor";
import { GetPeerCounsellors } from "./../usecases/GetPeerCounsellors";
import { AddCounsellor } from "./../usecases/AddCounsellor";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generate } from "randomstring";
import UserRepository from "../Repositories/User.repository";
import AuthServiceUtilities from "../Lib/utils/authServiceUtilities";

import { LogIn } from "../usecases/Login";
import { AddAdmin } from "../usecases/AddAdmin";
import { ViewProfile } from "../usecases/ViewProfile";
import { EditProfile } from "../usecases/EditProfile";
import { Registration } from "../usecases/Registration";
import { PasswordReset } from "../usecases/PasswordReset";
import { GetCounsellor } from "../usecases/GetCounsellor";
import { GetCounsellors } from "../usecases/GetCounsellors";
import { FetchUserMetrics } from "../usecases/FetchUserMetrics";
import { GetPeerCounsellor } from "../usecases/GetPeerCounsellor";
import { AddPeerCounsellor } from "../usecases/AddPeerCounsellor";
import { UpdateCounsellorSchedule } from "../usecases/UpdateCounsellorSchedule";
import { DeleteCounsellorOrPeerCounsellor } from "../usecases/DeleteCounsellorOrPeerCounsellor";
import { AddStudentDetails } from "../usecases/AddStudentDetails";
import { UniversityServiceProvider } from "./University.service";
import { RateCounsellor } from "../usecases/RateCounsellor";

export class UserServiceProvider {
  private readonly repo = new UserRepository();
  private readonly utility = new AuthServiceUtilities();
  private readonly universityService = new UniversityServiceProvider()
  private config() {
    return {
      env: process.env.NODE_ENV,
      multiTenantMode: process.env.MODE === "true" ? true : false,
    };
  }
  register = new Registration(
    this.repo,
    this.utility,
    this.universityService,
    bcrypt,
    this.config
  );
  login = new LogIn(this.repo, this.utility, jwt, bcrypt, this.config);
  fetchProfile = new ViewProfile(this.repo, this.config);
  editProfile = new EditProfile(this.repo, bcrypt, this.config);

  resetPassword = new PasswordReset(this.repo, generate, jwt, this.config);
  fetchUserMetrics = new FetchUserMetrics(this.repo, this.config);

  /**
   * Counsellor methods
   */

  addCounsellor = new AddCounsellor(this.repo, this.config);
  addPeerCounsellor = new AddPeerCounsellor(this.repo, this.config);
  addStudent = new AddStudentDetails(this.repo, this.config);
  fetchCounsellor = new GetCounsellor(this.repo, this.config);
  fetchCounsellors = new GetCounsellors(this.repo, this.config);
  fetchPeerCounsellors = new GetPeerCounsellors(this.repo, this.config);
  fetchPeerCounsellor = new GetPeerCounsellor(this.repo, this.config);
  updateCounsellorSchedule = new UpdateCounsellorSchedule(
    this.repo,
    this.config
  );
  rateCounsellor = new RateCounsellor(this.repo,this.config)
  updateCounsellorOrPeerCounsellor = new UpdateCounsellorOrPeerCounsellor(
    this.repo,
    this.config
  );
  deleteCounsellorOrPeerCounsellor = new DeleteCounsellorOrPeerCounsellor(
    this.repo,
    this.config
  );

  /**
   * Admin subRoutines
   */
  addAdministrator = new AddAdmin(this.repo, this.config);
}
