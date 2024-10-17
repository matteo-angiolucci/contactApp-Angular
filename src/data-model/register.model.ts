import { UserRole } from "./roleEnum.enum";

export interface IRegisterModel{
  name: string,
  email: string,
  password: string,
  role : UserRole,
  lastName : string,
  dateOfBirth: Date

}
