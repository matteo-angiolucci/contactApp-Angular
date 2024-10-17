import { UserRole } from "./roleEnum.enum";

export interface ILoginResponse{
  email : string,
  username: string,
  role : UserRole
}
