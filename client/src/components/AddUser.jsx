import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from '../components/Avatar'

function AddUser ({ userId, members, setMembers }) {
    if (!userId) return null;

    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch ();

    const [user, setUser] = useState ();

    async function getUser () {
        const res = await dispatch (getUserById (userId));
        setUser (res.payload.data?.userdetails);
    }

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
      

    useEffect (() => {
        getUser ();
    }, [userId])

    return (
        <div className="flex items-center gap-4 hover:cursor-pointer">
            <input 
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={members?.some(member => member.id === userId)}
            />
            <Avatar url={user?.image?.url} size={'md'}/>
            <h2 onClick={handleCheckboxChange}>{user?.name}</h2>
        </div>
    )
}

export default AddUser;