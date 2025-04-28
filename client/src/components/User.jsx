import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserById } from "../redux/Slices/auth.slice";
import { getMessages, setRecipient } from "../redux/Slices/chat.slice";
import { getGroupById } from "../redux/Slices/group.slice";

function User ({ chat, type, isAdmin, amAdmin }) {
    const authState = useSelector ((state) => state.auth);
    const liveGroup = useSelector ((state) => state.group.liveGroup)
    const online = useSelector ((state) => state.chat.onlineUsers);
    const socket = useSelector ((state) => state.socket.socket);

    const dispatch = useDispatch ();

    const defaultImage = "https://t3.ftcdn.net/jpg/12/81/12/20/240_F_1281122039_wYCRIlTBPzTUzyh8KrPd87umoo52njyw.jpg";

    const [user, setUser] = useState ();
    const [username, setUserName] = useState ("");
    const [content, setContent] = useState ("");
    const [name, setName] = useState ();

    function getContent () {
        // console.log ()
        const msg = chat.content.split (" ");
        if (msg[1] === "added") {
            const firstPerson = (authState.data?.username !== msg[0] ? msg[0] : "You");
            const secondPerson = (authState.data?.username !== msg[2] ? msg[2] : "you");
            setContent (firstPerson + " added " + secondPerson);
        }
        else {
            const firstPerson = (authState.data?.username !== msg[0] ? msg[0] : "You");
            setContent (firstPerson + " " + msg.slice(1).join(" "));
        }
    }

    async function getChats () {
        if (type !== 'groups') {
            await dispatch (getMessages ( {
                sender: authState.data?._id,
                recipient: chat?.user?._id || user?._id
            }));
            await dispatch (setRecipient ({ userDetails: chat?.user || user }))
        } else{
            await dispatch(getGroupById(chat.groupId));
        }
    }
 
    async function getUser () {
        const res = await dispatch (getUserById (chat));
        setUser (res.payload.data?.userdetails);
    }

    function makeAdmin () {
        if (socket && socket.connected) {
            socket.emit ("update-group", {
                _id: liveGroup._id,
                admin: authState.data._id,
                newAdmin: chat
            })
          }
    }

    useEffect (() => {
        if (chat.user) setUserName (chat.user?.username?.toString().slice(0, 25) + (chat.user?.username?.toString().length > 25 ? "..." : ""))
        if (user) setUserName (user?.username?.toString().slice(0, 25) + (user?.username?.toString().length > 25 ? "..." : ""))
        if (chat.group?.name) setUserName (chat.group?.name?.toString().slice(0, 25) + (chat.group?.name?.toString().length > 25 ? "..." : ""))
    }, [user, chat])

    useEffect (() => {
        setContent(chat.content);
        if (chat.messageType) getContent ();
        if (type === 'group-info' || type === "follower") getUser ();
    }, [chat._id])

    return (
        <div className="flex justify-between items-center">
            <div 
                className="relative flex flex-row items-center bg-transparent hover:shadow-md hover:cursor-pointer rounded-md hover:bg-[var(--topic)] p-2 w-full"
                onClick={getChats}
            >
                {isAdmin && <h2 className="absolute top-2 right-2 text-[0.6rem] bg-[var(--card)] font-semibold p-1 px-2 rounded-sm">Admin</h2>}
                {(!isAdmin && amAdmin) && <h2 className="absolute bottom-2 right-2 text-[0.6rem] border hover:bg-[var(--card)] font-semibold p-1 px-2 rounded-sm" onClick={makeAdmin}>Make admin</h2>}
                <img src={chat?.user?.image?.url || user?.image?.url || chat?.group?.image?.url || defaultImage} className="flex items-center justify-center h-8 w-8 rounded-full object-cover"/>
                <div className="ml-2 w-full">
                    <h2 className="text-sm font-semibold">{(username === authState.data.username ? "You" : username) || (user?.name === authState.data.user?.name ? "You" : username) || chat?.group?.name}</h2>
                    {(type !== 'group-info' && type !== 'follower') && <h3 className="text-xs font-extralight">{content?.toString().slice(0, 20) + (content?.length > 20 ? "..." : "")}</h3>}
                </div>
                {(online?.includes(chat?.user?._id || user?._id) && chat?.user?._id !== authState.data?._id && user?._id !== authState.data?._id) && <div className="w-[0.7rem] h-[0.6rem] bg-green-400 rounded-full inline-block"></div>}
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default User;