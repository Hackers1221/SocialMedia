import React from "react";

function LikeNotification({ username, avatarUrl, postTitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition max-w-md w-full"
    >
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
        <p className="text-sm text-gray-800">
          <span className="font-semibold">{username}</span> liked your post{" "}
          <span className="font-medium text-blue-600">"{postTitle}"</span>
        </p>
      </div>
    </div>
  );
}

export default LikeNotification;
