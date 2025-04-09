import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserById } from "../redux/Slices/auth.slice";
import { getMessages, setRecipient } from "../redux/Slices/chat.slice";
import { getGroupById, getRecentMessage } from "../redux/Slices/group.slice";

function User ({ chat, type }) {
    const authState = useSelector ((state) => state.auth);
    const chatState = useSelector ((state) => state.chat);

    const dispatch = useDispatch ();


    const content = chat.content?.toString().slice(0, 20) + (chat.content?.length > 20 ? "..." : "")

    const defaultImage = "https://t3.ftcdn.net/jpg/12/81/12/20/240_F_1281122039_wYCRIlTBPzTUzyh8KrPd87umoo52njyw.jpg";

    const [user, setUser] = useState ();
    const [username, setUserName] = useState ("");

    async function getChats () {
        if (type !== 'groups') {
            await dispatch (getMessages ( {
                sender: authState.data?._id,
                recipient: chat?.user?._id || user?._id
            }));
            await dispatch (setRecipient ({ userDetails: chat?.user || user }))
        }
    }
 
    async function getUser () {
        const res = await dispatch (getUserById (chat));
        setUser (res.payload.data?.userdetails);
    }

    useEffect (() => {
        if (chat.user) setUserName (chat.user?.username?.toString().slice(0, 25) + (chat.user?.username?.toString().length > 25 ? "..." : ""))
        if (user) setUserName (user?.username?.toString().slice(0, 25) + (user?.username?.toString().length > 25 ? "..." : ""))
        if (chat.name) setUserName (chat.name?.toString().slice(0, 25) + (chat.name?.toString().length > 25 ? "..." : ""))
    }, [user])

    useEffect (() => {
        if (type === 'follower') getUser ();
    }, [])

    return (
        <div 
            className="flex flex-row items-center bg-transparent hover:shadow-md hover:cursor-pointer rounded-md hover:bg-[var(--topic)] p-2"
            onClick={getChats}
        >
            <img src={chat?.user?.image?.url || user?.image?.url || chat?.group?.image?.url || defaultImage} className="flex items-center justify-center h-8 w-8 rounded-full object-cover"/>
            <div className="ml-2 w-full">
                <h2 className="text-sm font-semibold">{username || user?.name || chat?.group?.name}</h2>
                {type !== 'follower' && <h3 className="text-xs font-extralight">{content}</h3>}
            </div>
            {chatState.onlineUsers?.includes(chat?.user?._id || user?._id) && <div className="w-[0.7rem] h-[0.6rem] bg-green-400 rounded-full inline-block"></div>}
        </div>
    )
}

export default User;