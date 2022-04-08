import mongoose from "mongoose";
import { defaultCronRule, languages } from "../utils/consts.js";

const UserSchema = mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
    },
    username: String,
    first_name: String,
    location: {
        name: String,
        coordinates: {
            lat: Number,
            lon: Number,
        },
    },
    lang: {
        type: String,
        default: languages.UA,
    },
    notifications: {
        rule: {
            type: String,
            default: defaultCronRule,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
});

export default mongoose.model("User", UserSchema);
