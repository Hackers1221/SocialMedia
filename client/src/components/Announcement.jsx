import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { congratulate, sorrify } from "../redux/Slices/announcement.slice";
import LinkDetector from "./LinkDetector";
import { getTimeDifference } from "../utils/time";

function Announcement ({_id, userImage, userName, announcementText, createdAt, congratulation, sorry}) {
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch ();

    const [time, setTime] = useState ();
    const [isOpen, setOpen] = useState (false);

    async function handleCongratulate () {
        if (userName == authState.data?.username) return;
        if (congratulation.includes (authState.data?._id)) return;
        const res = await dispatch (congratulate ({
            _id,
            id: authState.data?._id
        }))
    }

    async function handleSorrify () {
        if (userName == authState.data?.username) return;
        if (sorry.includes (authState.data?._id)) return;
        const res = await dispatch (sorrify ({
            _id,
            id: authState.data?._id
        }))
    }

    useEffect (() => {
        setTime (getTimeDifference (createdAt))
    }, [_id])

    return (
        <div className="p-2 shadow-2xl w-full">
            <ConfirmDeleteDialog open={isOpen} setOpen={setOpen} type={"announcementDelete"} id={_id}/>
            <div className="flex justify-between items-start">
                <div className="break-words justify-between text-sm mb-3 text-[var(--text)] whitespace-pre-wrap w-[90%]">
                    <LinkDetector title={announcementText} type={'announcement'}></LinkDetector>
                </div>
                {authState.data?.username == userName && <div className="dropdown dropdown-end">
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
                </div>}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {/* <Avatar url={userImage.url} size={'sm'}/> */}
                    <Link to={`/profile/${userName}`} className="text-xs font-extralight">@{userName}</Link>
                    <div className="flex items-center gap-2">
                        <div 
                            title="Congratulate" 
                            className="flex justify-center items-center px-1 hover:bg-[var(--background)] rounded-md hover:cursor-pointer"
                            onClick={handleCongratulate}>
                            <h2>👏</h2>
                            <h2 className="text-xs">{congratulation?.length}</h2>
                        </div>
                        <div 
                            title="Feeling sorry" 
                            className="flex justify-center items-center px-1 hover:bg-[var(--background)] rounded-md  hover:cursor-pointer"
                            onClick={handleSorrify}>
                            <h2>😢</h2>
                            <h2 className="text-xs">{sorry?.length}</h2>
                        </div>
                    </div>
                </div>
                <h2 className="text-xs">{time}</h2>
            </div>
        </div>
    )
}

export default Announcement;