import { Schema, model } from 'mongoose';
import IBugs from "../@types/mongo/bugs-model";

const bugsSchema = new Schema({
    userID: Number,
    username: String,
    bug: Array
});

export default model<IBugs>('bugs', bugsSchema);
