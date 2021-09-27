/* istanbul ignore file */
/**
 * @fileOverview contains the various functions to manage user's request validation .
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import Joi from "joi";
 import { IUser } from "@Models/User.model";
 
 export interface IAuthserviceUtilities {
   loginValidation(
     _entityBody: {email: string, password: string}
   ): Joi.ValidationResult;
 
   registrationValidation(
     _entityBody: IUser
   ): Joi.ValidationResult;
 }
 export default class AuthServiceUtilities implements IAuthserviceUtilities {
   public loginValidation(
     _entityBody: {email: string, password: string}
   ): Joi.ValidationResult {
     const schema = Joi.object({
       password: Joi.string().required(),
       email: Joi.string().email({
         minDomainSegments: 2,
         tlds: { allow: ["com", "net"] },
       }),
     });
 
     const result = schema.validate(_entityBody);
     return result;
   }
   public registrationValidation(
     _entityBody: IUser
   ): Joi.ValidationResult {
     const schema = Joi.object({
       name: Joi.string().min(3).max(30).required(),
       password: Joi.string()
         .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
         .required(),
       phone: Joi.string().min(10).required(),
       dob: Joi.string().required(),
       gender: Joi.string().required(),
       email: Joi.string()
         .email({
           minDomainSegments: 2,
           tlds: { allow: ["com", "net"] },
         })
         .required(),
     });
 
     const result = schema.validate(_entityBody);
     return result;
   }
 }