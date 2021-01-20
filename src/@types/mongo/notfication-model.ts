import { Document } from "mongoose";

export default interface notification_model extends Document{
    title: string;
    notification_body: string;
    date: Date;
}
