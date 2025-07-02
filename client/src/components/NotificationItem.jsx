import React, { useEffect, useState } from "react";

function NotificationItem({
  Item,
  onAccept,
  onDecline,
}) {

  const {type, sender, recipient, targetType, post, pulse, commentText, timestamp} = Item;
  const [time, setTime] = useState("");

  // converting time in words
  function getTimeDifference(dateString) {
    const now = new Date();
    const targetDate = new Date(dateString);

    const nowUTC = Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()
    );

    const targetDateUTC = Date.UTC(
        targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(),
        targetDate.getUTCHours(), targetDate.getUTCMinutes(), targetDate.getUTCSeconds()
    );

    const diffInSeconds = Math.floor((nowUTC - targetDateUTC) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}min`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays}d`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths}m`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y`;
  }


  const renderAvatar = () => (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
      {sender.image?.url ? (
        <img src={sender.image.url} alt={sender.username} className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full text-[var(--text)] text-lg font-semibold">
          {sender.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
  const getTime = () => (
    <span className="absolute top-8 right-5 text-xs text-[var(--text)]">{time} ago</span>
  );

  useEffect(() => {
    setTime(getTimeDifference(timestamp));
  }, [timestamp]);

  if (type === "like") {
    return (
      <div
        className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition w-full"
      >
        {getTime()}
        {renderAvatar()}
        <div className="flex-1">
          <p className="text-sm text-[var(--heading)]">
            <span className="font-semibold text-[var(--heading)]">{sender.username}</span> liked your {targetType}{" "}
            {post && <span className="font-medium text-[var(--text)] w-[80%]">"{post.caption}"</span>}
            {pulse && <span className="font-medium text-[var(--text)] w-[80%]">"{pulse.caption}"</span>}
          </p>
        </div>
      </div>
    );
  }

  if (type === "mention") {
    return (
      <div
        className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition w-full"
      >
        {getTime()}
        {renderAvatar()}
        <div className="flex-1">
          <p className="text-sm text-[var(--heading)]">
            <span className="font-semibold text-[var(--heading)]">{sender.username}</span> mentioned you in a recent {targetType}{" "}
          </p>
        </div>
      </div>
    );
  }

  if (type === "comment") {
    return (
      <div
        className="flex items-start gap-4 relative p-4 bg-[var(--card)] rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition w-full"
      >
        {getTime()}
        {renderAvatar()}
        <div className="flex-1">
          <p className="text-sm text-[var(--heading)] mb-1">
            <span className="font-semibold">{sender.username}</span> commented on your {targetType}
          </p>
          <p className="text-sm text-[var(--text)] italic  w-[80%]">"{commentText}"</p>
        </div>
      </div>
    );
  }

  if (type === "follow-request") {
    return (
      <div className="flex items-center gap-4 relative p-4 bg-[var(--card)] rounded-2xl shadow-md w-full">
        {renderAvatar()}
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--heading)]">{sender.username}</p>
          <p className="text-xs text-[var(--text)]">sent you a follow request</p>
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

  return null;
}

export default NotificationItem;
