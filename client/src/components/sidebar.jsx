import { FaHome } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBookmark } from "react-icons/fa6";
import PostDialog from "./PostDialog";
import { Link, useLocation, useNavigate } from "react-router-dom"
import PostForm from "./PostForm";
import PulseForm from "./PulseForm";
import { useDispatch, useSelector } from "react-redux";
import { logout, markAsRead, searchUser } from "../redux/Slices/auth.slice";
import { deleteNonFR } from "../redux/Slices/notification.slice";
import { IoMdPulse } from "react-icons/io";
import Avatar from "./Avatar";
import MoreOptions from "./MoreOptions";

function Sidebar() {
    const authState = useSelector ((state) => state.auth);

    const [isOpen, setIsOpen] = useState(false);
    const [isPostForm, setIsPostForm] = useState(false);
    const [isPulseForm, setIsPulseForm] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [selected, setSelected] = useState ('Feed');
    const [menuOpen, setMenuOpen] = useState (false);

    const navigate = useNavigate ();
    const dispatch = useDispatch();

    useEffect (() => {
        if (!authState?.isLoggedIn || !authState?.data?.email) {
            navigate ("/login"); return;
        }
        
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isOpen && screenWidth < 768) {
                const sidebar = document.getElementById("sidebar");
                if (sidebar && !sidebar.contains(e.target)) {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isOpen, screenWidth]);

    return (
        <>
            {/* add post dialog box */}
            <PostDialog 
                open={isDialogOpen} 
                setOpen={setDialogOpen} 
                onAddPost={() => {
                    setDialogOpen(false); 
                    setIsPostForm(true); 
                }} 
                onAddPulse={() => {
                    setDialogOpen(false); 
                    setIsPulseForm(true); 
                }} 
            />
            <PostForm open={isPostForm} setOpen={setIsPostForm}/>
            <PulseForm open={isPulseForm} setOpen={setIsPulseForm} />

            <MoreOptions open={menuOpen} setOpen={setMenuOpen}/>

            <div className="fixed top-0 left-0 w-full z-[10] md:z-0">
                {/* Wrapper to avoid misclicks */}
                <div className="relative z-10 md:hidden p-4 flex w-full justify-between">
                    {!isOpen && (
                        <GiHamburgerMenu
                            id="menu-toggle"
                            className="text-3xl text-white cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(true);
                            }}
                        />
                    )}
                    <Link to={`/profile/${authState?.data?.username}`}>
                        <Avatar url={authState.data?.image?.url} size={'md'}/>
                    </Link>
                </div>
                

                <div
                    id="sidebar"
                    className={`fixed top-0 left-0 flex flex-col w-[18em] bg-[var(--card)] h-screen shadow-md transform ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none border-r border-[var(--border)]`}
                    onClick={(e) => e.stopPropagation()} // Prevents click inside from closing
                >
                    <div className={`p-4 flex items-end gap-2`}>
                        <img src="../../Logo.png" className="w-[3.5rem] h-[2.5rem]"/>
                        <div className={`text-2xl font-bold heading text-[var(--buttons)]`}>Ripple</div>
                    </div>
                    <div className="flex flex-col h-full justify-between overflow-y-auto overflow-x-hidden flex-grow">
                        <ul className="flex flex-col py-4 space-y-1">
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`pb-1 text-sm font-bold text-[var(--heading)] border-b-2 border-[var(--buttons)]`}>Discover</div>
                                </div>
                            </li>
                            <li onClick={() => {setIsOpen(false); setMenuOpen(false); setSelected('Feed')}}>
                                <Link to="/" className={`relative border-l-4 hover:border-[var(--buttons)] flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Feed' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <FaHome className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Feed</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setMenuOpen(false); setSelected('Explore')}}>
                            <Link to="/explore" className={`relative border-l-4 hover:border-[var(--buttons)] flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Explore' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <MdExplore className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Explore</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setMenuOpen(false); setSelected('Pulse')}}>
                            <Link to="/pulse" className={`relative border-l-4 hover:border-[var(--buttons)] flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Pulse' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <IoMdPulse className="ml-4"/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Pulse</span>
                                </Link>
                            </li>
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`pb-1 text-sm font-bold text-[var(--heading)] border-b-2 border-[var(--buttons)]`}>Interact</div>
                                </div>
                            </li>
                            <li onClick={() => {setIsOpen(false); setMenuOpen(false); setSelected('Messages')}}>
                                <Link to="/message" className={`relative border-l-4 hover:border-[var(--buttons)] flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Messages' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <IoChatboxEllipsesSharp className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
                                </Link>
                            </li>
                            <li onClick={async () => {
                                    setIsOpen(false); 
                                    setMenuOpen(false); 
                                    setSelected('Notification'); 
                                    if(authState.isRead == false) dispatch(deleteNonFR(authState?.data?._id));
                                    dispatch(markAsRead());
                                }}>
                                <Link to="/notification" className={`relative flex flex-row border-l-4 border-transparent hover:border-[var(--buttons)] items-center h-11 text-[var(--text)] hover:text-[var(--buttons)] hover:shadow-md font-semibold pr-4 border-l-4 border-transparent pr-6 ${selected === 'Notification' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <FaBell className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                                    {authState?.isRead == false && authState?.notifications?.length > 0 && <span className="w-2.5 h-2.5 ml-auto rounded-full bg-red-500 inline-block" />                                    }
                                </Link>
                            </li>
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`pb-1 text-sm font-bold text-[var(--heading)] border-b-2 border-[var(--buttons)]`}>Manage</div>
                                </div>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <div onClick={() => setDialogOpen(true)} className={`relative flex flex-row border-l-4 border-transparent hover:border-[var(--buttons)] items-center h-11 text-[var(--text)] hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 border-transparent pr-6 hover:cursor-pointer`}>
                                    <LuCircleFadingPlus className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Create Post</span>
                                </div>
                            </li>
                            <li onClick={() => {setIsOpen(false); setMenuOpen(false); setSelected('Saved')}}>
                                <Link to="/saved" className={`relative border-l-4 hover:border-[var(--buttons)] flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Saved' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <FaBookmark className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Saved</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="flex flex-col py-4 space-y-1">
                            {screenWidth > 768 && <li onClick={() => {setIsOpen(false); setMenuOpen(false); setSelected('Profile')}}>
                                <Link to={`/profile/${authState?.data?.username}`} className={`relative border-l-4 hover:border-[var(--buttons)] flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pl-4 ${selected === 'Profile' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <Avatar url={authState?.data?.image?.url} size={"sm"}/>
                                    <span className="ml-2 text-sm tracking-wide truncate">{authState.data?.username}</span>
                                </Link>
                            </li>}
                            <li onClick={() => {setMenuOpen (!menuOpen); setSelected('More')}}>
                                <div className={`relative border-l-4 hover:border-[var(--buttons)] hover:cursor-pointer flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold border-l-4 pl-4 ${selected === 'More' ? `border-[var(--buttons)] text-[var(--buttons)] shadow-md` : `border-transparent text-[var(--text)]`}`}>
                                    <i className="fa-solid fa-bars text-[var(--buttons)]"></i>
                                    <span className="ml-2 text-sm tracking-wide truncate">More</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>           
            </div>
        </>
    );
}

export default Sidebar;
