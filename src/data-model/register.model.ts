import { UserRole } from "./roles";

export interface IRegisterModel{
  name: string,
  email: string,
  password: string,
  role : UserRole,
  lastName : string,
  dateOfBirth: Date,
  active: boolean

}
