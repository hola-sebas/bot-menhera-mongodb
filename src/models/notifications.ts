import { Schema, model } from 'mongoose';
import INotifications from "../@types/mongo/notfication-model";

const notificationsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    notification_body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date(Date.now())
    }
});

export default model<INotifications>('notifications', notificationsSchema);
