import { UserRole } from "./roles";

export interface ILoginResponse{
  email : string,
  name: string,
  role : UserRole
}
