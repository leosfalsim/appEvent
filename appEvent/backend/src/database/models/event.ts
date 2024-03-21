import mongoose, { Schema } from "mongoose";
import { IEvent } from "./../../../../frontend/src/app/interfaces/IEvent";

export interface IEventModel extends IEvent {}

const EventSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    eventColor: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    members: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
},
{
    timestamps: true
});

export default mongoose.model<IEventModel>('Event', EventSchema);