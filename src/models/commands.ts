import { Schema, model } from 'mongoose';
import ICommands from "../@types/mongo/commnads-model";

const guildSchema = new Schema({
    commands: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
})

export default model<ICommands>('commands', guildSchema)

