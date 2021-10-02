/**
 * @fileOverview manages user registration process.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IUser } from "@Models/User.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IUserRepository } from "@Repositories/User.repository";
import { UniversityServiceProvider } from "../service/University.service";
import { IAuthserviceUtilities } from "@Rada/src/Lib/utils/authServiceUtilities";

export class Registration {
  constructor(
    private readonly repo: IUserRepository,
    private readonly utility: IAuthserviceUtilities,
    private readonly uniService: UniversityServiceProvider,
    private readonly bcrypt: any,
    private readonly config: () => {
      env: string | undefined;
    }
  ) {}
  public async registeruser(
    newUser: IUser
  ): Promise<
    | ResultPayload<{ message: string; user: IUser }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      // validate the user input
      const { error } = this.utility.registrationValidation(newUser);
      if (error) {
        throw new Error(`${error.details[0].message}`);
      }

      // check if the email already exists
      const user = await this.repo.find({
        field: "email",
        value: newUser.email,
      });
      if (user?.email) {
        throw new Error("email already exists");
      }

      const uni = await this.uniService.fetchUniversity.fetch(
        newUser.University_id
      );
      const { _id } = uni?.getPayload() as unknown as {
        name: string;
        _id: string;
      };
      // encrpte the password
      const encrptedPass = await this.bcrypt.hash(newUser.password, 10);
      // create a new user
      const savedUser = await this.repo.insert({
        name: newUser.name,
        email: newUser.email,
        password: encrptedPass,
        profilePic: newUser.profilePic,
        gender: newUser.gender,
        dob: newUser.dob,
        phone: newUser.phone,
        status: newUser.status,
        account_status: newUser.account_status,
        synced: newUser.synced,
        joined: newUser.joined,
        University_id: _id,
      });
      if (!savedUser) {
        throw new Error("cannot send mail to user of undefined");
      }

      // const payload = { email: savedUser.email };

      const result = {
        message: "registration sucessfull ",
        user: savedUser,
      };

      return new ResultPayload<{ message: string; user: IUser }>(result, 200);
    } catch (error: any) {
      /* istanbul ignore else */
      const msg =
        this.config().env !== "production"
          ? error.message
          : "unable to register new user at the moment please try again";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
