const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        type: {
            type: String,
            enum: ["like", "comment", "follow-request", "mention"],
            required: true,
        },
        targetType: {
            type: String,
            enum: ["post", "pulse", "announcement"],
            required: function () {
                return this.type === "mention" || this.type === "like" || this.type === "comment";
            }
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
            required: function () {
                return this.targetType === "post";
            }
        },
        pulse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pulse",
            required: function () {
                return this.targetType === "pulse";
            }
        },
        announcement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pulse",
            required: function () {
                return this.targetType === "announcement";
            }
        },
        commentText: {
            type: String,
            required: function () {
                return this.type === "comment";
            },
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
