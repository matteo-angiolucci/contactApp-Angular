import { UserRole } from "./roleEnum.enum";

export interface ILoginResponse{
  email : string,
  name: string,
  role : UserRole
}
