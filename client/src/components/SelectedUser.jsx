import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "./AddUser";
import { useNavigate } from 'react-router-dom';
import { getUserById } from "../redux/Slices/auth.slice";
import { showToast } from "../redux/Slices/toast.slice";
import Loader from "./Loader";

function SelectedUser ({ isOpen, setOpen, post }) {
    const socket = useSelector ((state) => state.socket.socket);
    const authState = useSelector ((state) => state.auth);

    const dialogRef = useRef (null);
    const navigate = useNavigate ();
    const dispatch = useDispatch ();

    const [followers, setFollowers] = useState ([]);
    const [selectedUsers, setSelectedUsers] = useState ([]);
    const [isLoading, setLoading] = useState (false);

    function share () {
        selectedUsers.map ((user) => {
            const payload = {
                sender: user.addedBy,
                recipient: user.id,
                content: post,
                isPost: true,
                files: []
            };

            if (socket && socket.connected) {
                socket.emit("sendMessage", payload);
            }
        })

        setOpen (!isOpen);

        navigate ('/message');
    }

    const copyLink = async () => {
        try {
            const postLink = `${window.location.origin}/posts/${post._id}`
            await navigator.clipboard.writeText(postLink);
            dispatch (showToast ({
                message: "Link copied to clipboard!",
                type: "success",
            }));
        } catch (error) {
            dispatch (showToast ({
                message: "Failed to copy link",
                type: "error",
            }));
        }
    };

    async function getFollowerDetails () {
        setLoading (true);
        try {
            const promises = authState.data.follower?.map((userId) =>
                dispatch (getUserById (userId))
            );
            const results = await Promise.all (promises);
        
            const newUsers = results
                .map((res) => res?.payload?.data?.userdetails)
                .filter(Boolean); // Filter out failed/null responses
        
            setFollowers (newUsers);
        } catch (error) {
            setLoading (false);
            dispatch (showToast ({ message: "Could not load your followers", type: "error" }));
        } finally {
            setLoading (false);
        }
    }

    useEffect (() => {
        if (isOpen) getFollowerDetails ();

        if (isOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
        else if (!isOpen && dialogRef.current?.open) {
            dialogRef.current.close();
        }

    }, [isOpen]);

    return (
        <>
            {isOpen && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>}
            <dialog ref={dialogRef} className="w-[30%] h-[80%] bg-[var(--background)] py-4 z-10">
                <button onClick={() => setOpen (!isOpen)} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[10]`}>✕</button>
                <div className="relative flex flex-col gap-2 px-4 h-full">
                    <div className={`flex items-center w-full rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                        <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                        <input
                            type="text"
                            placeholder="Search participants ..."
                            className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                            // onChange={onChangeHandler}
                            name = "query"
                            // value = {query}
                        />
                        <button className={`text-[var(--text)] text-2xl h-full`}>
                            <X />
                        </button>
                    </div>
                    {isLoading ? <Loader /> : followers?.length > 0 ? followers?.map ((user, key) => (
                        <AddUser userId={user._id} image={user.image} username={user.username} members={selectedUsers} setMembers={setSelectedUsers} key={key}/>
                    )) : <h2>No user to send</h2>}

                    <div className="absolute bottom-4 w-[93%] flex justify-evenly items-center gap-2">
                        <div onClick={copyLink} className="w-full flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                            
                            <h2 className="text-black font-bold text-[var(--buttonText)] bg-[var(--buttons)] p-2 rounded-md w-full text-center">
                                <i className="fa-solid fa-link mr-2"></i> Copy Link</h2>
                        </div>
                        <div onClick={share} className="w-full flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                            <h2 className="text-black font-bold text-[var(--buttonText)] bg-[var(--buttons)] p-2 rounded-md w-full text-center">Send</h2>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default SelectedUser;