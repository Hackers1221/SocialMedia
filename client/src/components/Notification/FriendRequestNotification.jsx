import React from "react";

function FriendRequestNotification({ username, avatarUrl, onAccept, onDecline }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-md max-w-md w-full">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg font-semibold">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{username}</p>
        <p className="text-xs text-gray-500">sent you a friend request</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDecline}
          className="px-3 py-1 text-sm rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="px-3 py-1 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default FriendRequestNotification;
