import { useDispatch, useSelector } from "react-redux";
import { getUserById, getUserByLimit, searchUser } from "../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { FaBullhorn, FaUserFriends } from "react-icons/fa";
import AnnouncementForm from "./AnnouncementForm";
import { getAllAnonuncement } from "../redux/Slices/announcement.slice";
import Announcement from "./Announcement";

import { AnimatePresence, motion } from "framer-motion";

function RightPanel () {
    const authState = useSelector ((state) => state.auth);
    const chatState = useSelector ((state) => state.chat);
    const announcementState = useSelector ((state) => state.announcement);

    const dispatch = useDispatch ();

    const [query, setQuery] = useState ();
    const [searchResult, setSearchResult] = useState ([]);
    const [followers, setFollowers] = useState ([]);
    const [check, setCheck] = useState (0);
    const [isOpen, setOpen] = useState (false);
    const [seeFullAnnouncements, setSeeFullAnnouncements] = useState (false);
    const [seeFullFollowers, setSeeFullFollowers] = useState (false);

    function onChangeHandler(e){
        const value = e.target.value;
        setQuery(value)
        setCheck (value.length);
    }

    async function getUser () {
        await dispatch (getUserByLimit ({
            userId: authState.data?._id,
            limit: 7
        }));
    }

    async function getFollowers () {
        authState.data?.follower?.map (async (userId) => {
            const res = await dispatch (getUserById (userId));

            setFollowers((prev) => [...prev, res.payload?.data?.userdetails]);
        })
    }

    async function getAnnouncements () {
        await dispatch (getAllAnonuncement (authState.data?._id))
    }

    useEffect(() => {
            if(query?.trim() == ""){
                setCheck (0);
                setSearchResult([]);
                return;
            }
            // Set a timeout to wait before making the API call
            const delayDebounceFn = setTimeout(async () => {
                try {   
                    const response = await dispatch(searchUser (query));
                    setSearchResult(response.payload?.data?.userdata);
                } catch (error) {
                    console.error("Search failed:", error);
                }
            }, 300); // 300ms debounce delay
            return () => clearTimeout(delayDebounceFn);
        },[query])
    
    useEffect (() => {
        setFollowers ([]);
        getFollowers ();
    }, [authState?.data?.follower])

    useEffect (() => {
        setFollowers([]);
        getUser ();
        getAnnouncements ();
    }, [])

    return (
        <section className={`fixed top-0 right-[1rem] flex-col md:flex-col overflow-auto w-full lg:max-w-sm h-full pt-2`}>
            <AnnouncementForm open={isOpen} setOpen={setOpen}/>
            <div className={`flex flex-col gap-2 ml-8`}>
                <div className={`bg-transparent`}>
                    <div className={`flex items-center rounded-md px-4 my-4 mx-2 shadow-md border border-[var(--input)]`}>
                        <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                        <input
                            type="text"
                            placeholder="Search users"
                            className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none`}
                            onChange={onChangeHandler}
                            name = "query"
                            value = {query}
                        />
                        {query && <button onClick={() => setQuery ("")} className={`text-[var(--text)] text-2xl h-full`}>
                            <X />
                        </button>}
                    </div>
                    <div>
                        {searchResult?.map((user, index) => (
                            <Link to={`/profile/${user?.username}`} key={index} className={`text-[var(--text)] mt-2 p-2 py-3 flex items-center space-x-2 hover:shadow-md hover:cursor-pointer bg-[var(--card)] hover:text-[var(--heading)]`}>
                                {user.image?.url ? 
                                    <Avatar id={user._id} url = {user.image?.url} size={'md'}/> : 
                                    <RxAvatar />
                                    }
                                <div>
                                    <p className={`font-semibold text-sm`}>{user.name}</p>
                                    <div className={`text-xs flex gap-1`}>
                                        <span>{user.username}</span> • <span>{user.follower?.length ? user.follower?.length : 'No'} follower{user.follower?.length <= 1 ? '' : 's'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {check == 0 && <div className={`ml-8 text-[var(--text)] text-xl rounded-md bg-[var(--card)] mt-8 shadow-lg px-2`}>
                <div className={`flex items-center justify-between bg-[var(--topic)] rounded-t-xl p-2`}>
                    <div className="flex items-center gap-4">
                        <FaBullhorn className="text-white text-md"/>
                        <h2 className="pb-1 font-bold text-sm text-[var(--heading)] border-b-2 border-[var(--buttons)]">Announcements</h2>
                    </div>
                    <button 
                        className="text-[1.5rem] text-[var(--buttons)]"
                        onClick={() => setOpen (true)}>
                        +
                    </button>
                </div>
                {announcementState.downloadedAnnouncement?.length > 0 ? (
                    <AnimatePresence initial={false}>
                        {announcementState.downloadedAnnouncement
                        ?.slice(0, seeFullAnnouncements ? announcementState.downloadedAnnouncement.length : 3)
                        .map((announcement, key) => (
                            <motion.div
                            key={announcement._id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                            <Announcement
                                _id={announcement._id}
                                userImage={announcement.user.image}
                                userName={announcement.user.username}
                                announcementText={announcement.text}
                                createdAt={announcement.createdAt}
                                congratulation={announcement.congratulations}
                                sorry={announcement.sorry}
                            />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    ) : (
                    <h2 className="italic font-extraligt text-sm w-full text-center py-2">No announcements</h2>
                    )}

                    {announcementState.downloadedAnnouncement?.length > 3 && (
                    <h2
                        className="p-2 w-full text-xs text-center text-[var(--heading)] font-extralight cursor-pointer"
                        onClick={() => setSeeFullAnnouncements(!seeFullAnnouncements)}
                    >
                        {!seeFullAnnouncements ? "See more .." : "See less.."}
                    </h2>
                    )}
            </div>}

            {/* {check == 0 && authState.userList?.length > 0 && <div className={`ml-8 text-[var(--text)] text-xl rounded-xl bg-[var(--card)] shadow-lg mt-8`}>
                <div className={`flex justify-between items-center border-b bg-[var(--topic)] rounded-t-xl p-2`}>
                    <h2 className="font-bold text-sm text-[var(--heading)]">Friend Suggestions</h2>
                </div>
                {authState.userList?.map ((user, key) => (
                    <Link to={`/profile/${user?.username}`} key={key} className={`flex mt-2 gap-2 p-2 py-3 items-center border-b ${key === authState.userList?.length - 1 ? 'border-transparent' : 'border-[var(--border)]'} hover:cursor-pointer hover:shadow-md hover:text-[var(--heading)]`}>
                        <Avatar url={user.image?.url} size={"md"} />
                        <div className="flex justify-between w-full">
                            <div className="w-full">
                                <h2 className={`text-sm`}>{user.name}</h2>
                                <h2 className="text-xs font-extralight">@{user.username}</h2>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>} */}

            {!seeFullAnnouncements && check == 0 && followers?.length > 0 && <div className={`ml-8 text-[var(--text)] text-xl rounded-md bg-[var(--card)] mt-8 shadow-lg px-2`}>
                <div className={`flex items-center gap-4 bg-[var(--topic)] rounded-t-xl p-2`}>
                    <FaUserFriends className="text-white text-md"/>
                    <h2 className="pb-1 font-bold text-sm text-[var(--heading)] border-b-2 border-[var(--buttons)]">Who's Following You</h2>
                </div>
                <AnimatePresence initial={false}>
                    {followers
                        .slice(0, seeFullFollowers ? followers.length : 3)
                        .map((user, key) => (
                        <motion.div
                            key={user?._id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`flex mt-2 gap-2 p-2 py-3 items-center border-b ${
                            key === followers?.length - 1 ? "border-transparent" : "border-[var(--border)]"
                            } hover:cursor-pointer hover:shadow-md hover:text-[var(--heading)]`}
                        >
                            <Avatar id={user?._id} url={user?.image?.url} size={"md"} />
                            <div className="flex justify-between w-full">
                            <Link to={`/profile/${user?.username}`} className="w-full">
                                <h2 className="text-sm">{user?.name}</h2>
                                <h2 className="text-xs font-extralight">@{user?.username}</h2>
                            </Link>
                            </div>
                            {chatState.onlineUsers?.includes(user?._id) && (
                            <div className="w-[0.7rem] h-[0.6rem] bg-green-400 rounded-full inline-block"></div>
                            )}
                        </motion.div>
                        ))}
                    </AnimatePresence>

                    {followers?.length > 3 && (
                    <h2
                        className="p-2 w-full text-xs text-center text-[var(--heading)] font-extralight cursor-pointer"
                        onClick={() => setSeeFullFollowers(!seeFullFollowers)}
                    >
                        {!seeFullFollowers ? "See more .." : "See less.."}
                    </h2>
                    )}
            </div>}
            
        </section>
    )
}

export default RightPanel;