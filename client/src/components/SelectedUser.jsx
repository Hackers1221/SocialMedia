import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "./AddUser";
import { useNavigate } from 'react-router-dom';
import { getUserById } from "../redux/Slices/auth.slice";
import { showToast } from "../redux/Slices/toast.slice";
import Loader from "./Loader";

function SelectedUser ({ isOpen, setOpen, post, target }) {
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
                targetType: target,
                postId: post._id,
                files: []
            };

            if (socket && socket.connected) {
                socket.emit("sendMessage", payload);
            }
        })

        setOpen (!isOpen);

        navigate ('/message');
    }

    const handleWhatsAppShare = () => {
        const postLink = `See this Ripple post ${window.location.origin}/${target}/${post._id}`
        const url = `https://wa.me/?text=${encodeURIComponent(postLink)}`;
        window.open(url, "_blank");
    };

    const sendEmail = () => {
        const subject = "Check out this post";
        const body = `See this Ripple post : ${window.location.origin}/${target}/${post._id}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };


    const shareToTwitter = () => {
        const postLink = `See this Ripple post ${window.location.origin}/${target}/${post._id}`
        window.open (
            `https://www.x.com/intent/post?text=${encodeURIComponent(postLink)}`,
            "_blank"
        );
    };

    const copyLink = async () => {
        try {
            const postLink = `${window.location.origin}/${target}/${post._id}`
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
            {isOpen && (
            <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>
            )}

            <dialog
            ref={dialogRef}
            className="w-[95%] md:w-[40%] h-[80%] bg-[var(--background)] py-4 z-10 rounded-md"
            >
            <div className="relative flex flex-col gap-2 px-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold my-2">Share</h2>
                    <button
                        onClick={() => setOpen (!open)}
                        className="w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[50]">
                        ✕
                    </button>
                </div>

                {/* Search Bar - Top */}
                <div className="flex items-center w-full rounded-md px-2 shadow-md border border-[var(--input)]">
                    <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                    <input
                        type="text"
                        placeholder="Search participants ..."
                        className="w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm"
                        name="query"
                    />
                    <button className="text-[var(--text)] text-2xl h-full">
                        <X />
                    </button>
                </div>

                {/* User List - Scrollable Middle Section */}
                <div className="flex-1 overflow-y-auto my-2 pr-1">
                {isLoading ? (
                    <Loader />
                ) : followers?.length > 0 ? (
                    followers.map((user, key) => (
                    <AddUser
                        key={key}
                        userId={user._id}
                        image={user.image}
                        username={user.username}
                        members={selectedUsers}
                        setMembers={setSelectedUsers}
                    />
                    ))
                ) : (
                    <h2>No user to send</h2>
                )}
                </div>

                {/* Options - Bottom */}
                <div className="w-full pt-2 border-t-[0.1rem] border-[var(--card)]">
                    <div className="flex justify-evenly items-center gap-2">
                        <div
                        onClick={copyLink}
                        className="w-full flex flex-col justify-center items-center gap-2 rounded-md py-2 hover:cursor-pointer"
                        >
                        <div className="w-14 h-14 rounded-full p-4 bg-[var(--card)] flex items-center justify-center">
                            <i className="fa-solid fa-link"></i>
                        </div>
                        <h2 className="text-sm text-[var(--heading)] w-full text-center">Copy Link</h2>
                        </div>

                        <div
                        onClick={handleWhatsAppShare}
                        className="w-full flex flex-col justify-center items-center gap-2 rounded-md py-2 hover:cursor-pointer"
                        >
                        <div className="w-14 h-14 rounded-full p-4 bg-[var(--card)] flex items-center justify-center">
                            <i className="fa-brands fa-whatsapp text-xl"></i>
                        </div>
                        <h2 className="text-sm text-[var(--heading)] w-full text-center">WhatsApp</h2>
                        </div>

                        <div
                        onClick={sendEmail}
                        className="w-full flex flex-col justify-center items-center gap-2 rounded-md py-2 hover:cursor-pointer"
                        >
                        <div className="w-14 h-14 rounded-full p-4 bg-[var(--card)] flex items-center justify-center">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <h2 className="text-sm text-[var(--heading)] w-full text-center">Email</h2>
                        </div>

                        <div
                        onClick={shareToTwitter}
                        className="w-full flex flex-col justify-center items-center gap-2 rounded-md py-2 hover:cursor-pointer"
                        >
                        <div className="w-14 h-14 rounded-full p-4 bg-[var(--card)] flex items-center justify-center">
                            <i className="fa-brands fa-x-twitter"></i>
                        </div>
                        <h2 className="text-sm text-[var(--heading)] w-full text-center">X</h2>
                        </div>

                    </div>

                    {/* Send Button */}
                    {selectedUsers?.length > 0 && <div
                        onClick={share}
                        className="w-full flex justify-center items-center rounded-md py-2 hover:cursor-pointer"
                    >
                        <h2 className="text-sm font-bold text-[var(--buttonText)] bg-[var(--buttons)] p-2 rounded-md w-full text-center">
                        Send
                        </h2>
                    </div>}
                </div>
            </div>
            </dialog>
        </>
    );

}

export default SelectedUser;