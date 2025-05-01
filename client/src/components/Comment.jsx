import React, { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { likeComment } from '../redux/Slices/comment.slice';

const Comment = ({ commentId , username, text, time, avatar }) => {
  const defaultImage = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const commentState = useSelector((state) => state.comment);
  const [isLiked , setisLiked] = useState();
  const like = async() => {
    const response = await dispatch(likeComment(
      {
        _id : commentId,
        id : authState.data._id
      }
    ))
    if(response.payload){
      setisLiked(!isLiked);
    }
  }

  useEffect(() => {
    const comment = commentState.comments.find((c) => c._id === commentId);
    if (comment) {
      setisLiked(comment.likes.includes(authState.data._id));
    }
  }, [commentState.comments, commentId, authState.data._id]);  
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
          <p className="text-xs text-gray-400">{time} &nbsp; &nbsp;</p>
        </div>
  
        {/* Like Icon */}
        <div className='py-1'
        onClick = {like}>
          {!isLiked ? <FaRegHeart className="text-gray-400 hover:text-red-500 cursor-pointer" /> : <FaHeart className="text-red-500 cursor-pointer" />}
        </div>
      </div>
    );
  };

export default Comment
