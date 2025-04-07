import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from '../components/Avatar'

function AddUser ({ userId, members, setMembers }) {
    if (!userId) return null;

    const dispatch = useDispatch ();

    const [user, setUser] = useState ();

    async function getUser () {
        const res = await dispatch (getUserById (userId));
        setUser (res.payload.data?.userdetails);
    }

    function handleCheckboxChange () {
        setMembers ((prev) =>
          prev.includes(userId)
            ? prev.filter((item) => item !== userId) // remove if already selected
            : [...prev, userId] // add if not present
        );
      };

    useEffect (() => {
        getUser ();
    }, [userId])

    return (
        <div className="flex items-center gap-4">
            <input 
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={members.includes(userId)}
            />
            <Avatar url={user?.image?.url} size={'md'}/>
            <h2>{user?.name}</h2>
        </div>
    )
}

export default AddUser;