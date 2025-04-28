import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from '../components/Avatar'

function AddUser ({userId,image,username, members, setMembers }) {
    if (!userId) return null;

    const authState = useSelector ((state) => state.auth);

    function handleCheckboxChange() {
        setMembers((prev) => {
          const alreadyAdded = prev.some((item) => item.id === userId);
      
          if (alreadyAdded) {
            return prev.filter((item) => item.id !== userId);
          } else {
            return [
              ...prev,
              {
                id: userId,
                addedBy: authState.data?._id,
              },
            ]; 
          }
        });
      }

    return (
        <div className="flex items-center gap-4 hover:cursor-pointer" onClick={handleCheckboxChange}>
            <input 
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={members?.some(member => member.id === userId)}
            />
            <Avatar url={image?.url} size={'md'}/>
            <h2>{username}</h2>
        </div>
    )
}

export default AddUser;