// React hooks
import { useEffect, useState } from "react";
// React Router for navigation and location tracking
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getTimeDifference } from "../utils/time";

// NotificationItem component to render different types of notifications
function NotificationItem({
        Item,         // Notification item data
        onAccept,     // Function to handle follow request acceptance
        onDecline,    // Function to handle follow request decline
    }) {

    // Hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Destructure fields from notification item
    const { type, sender, targetType, post, pulse, commentText, timestamp } = Item;

    // Local state to store formatted time
    const [time, setTime] = useState("");

    // Navigate to post or pulse depending on notification type
    function openPost() {
        if (targetType === "post")
        navigate(`/post/${post}`, { state: { backgroundLocation: location.pathname } });
        if (targetType === "pulse")
        navigate(`/pulse/${pulse}`);
    }

    // Render avatar: either profile image or first letter of username
    const renderAvatar = () => (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {sender.image?.url ? (
            <img
                src={sender.image.url}
                alt={sender.username}
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="flex items-center justify-center h-full text-[var(--text)] text-lg font-semibold">
            {sender.username.charAt(0).toUpperCase()}
            </div>
        )}
        </div>
    );

    // Render formatted timestamp
    const getTime = () => (
        <span className="absolute right-5 text-xs text-[var(--text)]">{time} ago</span>
    );

    // Set relative time on mount/update
    useEffect(() => {
        setTime(getTimeDifference(timestamp));
    }, [timestamp]);

    // Render like notification
    if (type === "like") {
        return (
        <div
            onClick={openPost}
            className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-md shadow-sm hover:shadow-md cursor-pointer transition w-full"
        >
            {getTime()}
            {renderAvatar()}
            <div className="flex-1">
            <p className="text-sm text-[var(--heading)]">
                <Link
                to={`/profile/${sender.username}`}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-[var(--heading)] hover:underline"
                >
                {sender.username}
                </Link>{" "}
                liked your {targetType}
            </p>
            </div>
        </div>
        );
    }

    // Render mention notification
    if (type === "mention") {
        return (
        <div
            onClick={openPost}
            className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-md shadow-sm hover:shadow-md cursor-pointer transition w-full"
        >
            {getTime()}
            {renderAvatar()}
            <div className="flex-1">
            <p className="text-sm text-[var(--heading)]">
                <Link
                    to={`/profile/${sender.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[var(--heading)]"
                >
                {sender.username}
                </Link>{" "}
                mentioned you in a recent {targetType}
            </p>
            </div>
        </div>
        );
    }

    // Render comment notification
    if (type === "comment") {
        return (
        <div
            onClick={openPost}
            className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-md shadow-sm hover:shadow-md cursor-pointer transition w-full"
        >
            {getTime()}
            {renderAvatar()}
            <div className="flex-1">
            <p className="text-sm text-[var(--heading)] mb-1">
                <Link
                    to={`/profile/${sender.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[var(--heading)] hover:underline"
                >
                {sender.username}
                </Link>{" "}
                commented: 
                <span className="font-extralight text-sm text-[var(--text)] w-[80%]"> {commentText}</span>
            </p>
            </div>
        </div>
        );
    }

    // Render follow-request notification with Accept/Decline buttons
    if (type === "follow-request") {
        return (
        <div className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-2xl shadow-md w-full">
            {renderAvatar()}
            <div className="flex-1">
            <p className="text-sm font-medium text-[var(--heading)]">{sender.username}
                <span className="text-xs text-[var(--text)]"> sent you a follow request</span>
            </p>
            </div>
            <div className="flex gap-4 pr-3">
            <button
                onClick={onDecline}
                className="px-3 py-1 text-sm rounded-full bg-gray-300 hover:bg-gray-400 text-red-500"
            >
                Decline
            </button>
            <button
                onClick={onAccept}
                className="px-3 py-1 text-sm rounded-full bg-[#2c4d78] hover:bg-[#4d688c] text-white"
            >
                Accept
            </button>
            </div>
        </div>
        );
    }

    // Fallback for unsupported types
    return null;
}

export default NotificationItem;
