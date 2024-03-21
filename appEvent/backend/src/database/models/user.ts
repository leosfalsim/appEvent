import mongoose, { Schema } from "mongoose";
import { IUser } from "./../../../../frontend/src/app/interfaces/IUser";

export interface IUserModel extends IUser {}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
},
{
    timestamps: true
});

export default mongoose.model<IUserModel>('User', UserSchema);