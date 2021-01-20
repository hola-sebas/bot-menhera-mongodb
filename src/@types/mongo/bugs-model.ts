import { Document } from "mongoose";

export default interface bugs_model extends Document{
    userID: string;
    username: string;
    bug: Array<string>;
}
