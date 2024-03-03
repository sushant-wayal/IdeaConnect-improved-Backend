import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        profileImage: String,
        firstName: String,
        lastName: String,
    }],
    lastMessage: {
        type: String,
        default: "No message yet",
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    }],
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);