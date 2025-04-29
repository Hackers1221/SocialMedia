import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Comment = ({ username, text, time, avatar }) => {
  const defaultImage = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";
    return (
      <div className="flex items-start space-x-3 p-2 text-white">
        {/* Profile Image */}
        <div className='py-1'>
          <img
            src={avatar || defaultImage}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-pink-500"
          />
        </div>
  
        {/* Comment Content */}
        <div className="flex-1">
          <p className={`text-[var(--text)] text-sm font-semibold`}>
            <Link to={`/profile/${username}`} className={`hover:underline hover:text-[var(--buttons)] hover:cursor-pointer`}>{username}</Link> <span className={`text-sm text-[var(--text)] font-extralight`}>&nbsp; {text}</span>
          </p>
          <p className="text-xs text-gray-400">{time} &nbsp; &nbsp; Reply</p>
        </div>
  
        {/* Like Icon */}
        <div className='py-1'>
        <FaRegHeart className="text-gray-400 hover:text-red-500 cursor-pointer" />
        </div>
      </div>
    );
  };

export default Comment
