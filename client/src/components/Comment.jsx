import React from 'react'
import { FaRegHeart } from "react-icons/fa";

const Comment = ({ username, text, time, avatar }) => {
    return (
      <div className="flex items-start space-x-3 p-2 text-white">
        {/* Profile Image */}
        <img
          src={avatar}
          alt="Profile"
          className="w-8 h-8 rounded-full border border-pink-500"
        />
  
        {/* Comment Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold">
            {username} <span className="text-base text-gray-400 font-extralight">&nbsp; {text}</span>
          </p>
          <p className="text-xs text-gray-400">{time}  &nbsp; Reply</p>
        </div>
  
        {/* Like Icon */}
        <FaRegHeart className="text-gray-400 hover:text-red-500 cursor-pointer" />
      </div>
    );
  };

export default Comment
