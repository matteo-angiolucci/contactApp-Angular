import { IContactListItem } from "./contact-list-item.model";

export interface IContactDetails extends Omit<IContactListItem, 'id'> {
    id?:number;
    email?:string;
    lastName: string;
    firstName: string;
    birthDate?: Date;
}
