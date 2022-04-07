import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
    },
    first_name: {
        type: String,
    },
    location: {
        name: String,
        coordinates: {
            lat: {
                type: Number,
            },
            lon: {
                type: Number,
            },
        },
    },
    lang: {
        type: String,
        default: "ua",
    },
    notifications: {
        rule: {
            type: String,
            default: "0 6 * * *",
        },
        status: {
            type: Boolean,
            default: true,
        }
    },
});

export default mongoose.model("User", UserSchema);
