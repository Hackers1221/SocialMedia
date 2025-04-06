import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserById } from "../redux/Slices/auth.slice";
import { getMessages, setRecipient } from "../redux/Slices/chat.slice";

function User ({ userId }) {
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch ();

    const [name, setName] = useState ('Anonymous');
    const [image, setImage] = useState ('https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp');

    async function getUser () {
        const res = await dispatch (getUserById (userId));
        setName (res.payload.data?.userdetails?.name);
        setImage (res.payload.data?.userdetails?.image?.url);
    }

    async function getChats () {
        await dispatch (getMessages ( {
            sender: authState.data?._id,
            recipient: userId
        }));
        await dispatch (setRecipient ({ userDetails: {
            _id: userId,
            name: name,
            image: image 
        } }))
    }

    useEffect (() => {
        getUser ();
    }, [])

    return (
        <div 
            className="flex flex-row items-center hover:shadow-md hover:cursor-pointer rounded-md hover:bg-[var(--topic)] p-2"
            onClick={getChats}
        >
            <img src={image} className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"/>
            <div className="ml-2 text-sm font-semibold">{name}</div>
        </div>
    )
}

export default User;