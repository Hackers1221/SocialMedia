import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

function Announcement ({_id, userImage, userName, announcementText, createdAt}) {
    const authState = useSelector ((state) => state.auth);

    const [time, setTime] = useState ();
    const [isOpen, setOpen] = useState (false);

    function getTimeDifference(dateString) {
        const now = new Date();
        const targetDate = new Date(dateString);

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
            return `${diffInSeconds}s ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes}min ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays}d ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths}m ago`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears}y ago`;
    }

    useEffect (() => {
        setTime (getTimeDifference (createdAt))
    }, [_id])

    return (
        <div className="p-2 shadow-2xl w-full">
            <ConfirmDeleteDialog open={isOpen} setOpen={setOpen} type={"announcementDelete"} id={_id}/>
            <div className="flex justify-between items-start">
                <div className="break-words justify-between text-sm mb-3 text-[var(--text)] whitespace-pre-wrap w-[90%] mt-2">
                    {announcementText}
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button">
                        <i className={`text-[var(--text)] fa-solid fa-ellipsis text-sm`}></i>
                    </div>
                    <ul tabIndex={0} className={`dropdown-content menu bg-gray-700 rounded-md z-[1] w-52 gap-4 shadow-sm shadow-[var(--text)] text-[var(--buttons)]`}>
                        {<li
                            className="hover:cursor-pointer text-red-400 font-bold flex flex-row justify-between p-2"
                            onClick={() => setOpen (true)}>
                            Delete
                        </li>
                        }
                    </ul>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <Link to={`/profile/${userName}`} className="flex items-center gap-2">
                    <Avatar url={userImage.url} size={'sm'}/>
                    <h2 className="text-xs font-semibold">{userName}</h2>
                </Link>
                <h2 className="text-xs">{time}</h2>
            </div>
        </div>
    )
}

export default Announcement;