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
  const [timeDiff, setTimeDiff] = useState ("");


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

    function getTimeDifference (dateString) {
        const now = new Date();
        const targetDate = new Date(dateString);

        console.log (targetDate);

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

  useEffect(() => {
    setTimeDiff(getTimeDifference (time))
    const comment = commentState.comments.find((c) => c._id === commentId);
    if (comment) {
      setisLiked(comment.likes.includes(authState.data._id));
    }
  }, [commentState.comments, commentId, authState.data._id]);  

  console.log (timeDiff)

    return (
      <div className="flex items-start space-x-3 p-2 text-white">
        {/* Profile Image */}
        <div className='py-1'>
          <img
            src={avatar || defaultImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
  
        {/* Comment Content */}
        <div className="flex-1">
          <p className={`text-[var(--text)] text-sm font-semibold`}>
            <Link to={`/profile/${username}`} className={`hover:underline hover:text-[var(--buttons)] hover:cursor-pointer`}>{username}</Link> <span className={`text-sm text-[var(--text)] font-extralight`}>&nbsp; {text}</span>
          </p>
          <p className="text-xs text-gray-400">{timeDiff} &nbsp; &nbsp;</p>
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
