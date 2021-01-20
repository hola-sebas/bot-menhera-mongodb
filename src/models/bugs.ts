import { Schema, model } from 'mongoose';
import IBugs from "../@types/mongo/bugs-model";

const bugsSchema = new Schema({
    userId: Number,
    username: String,
    bug: Array
})

export default model<IBugs>('bugs', bugsSchema);
