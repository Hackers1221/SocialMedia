import { FaHome } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { FaBell, FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { LuCircleFadingPlus } from "react-icons/lu";
import { ImVideoCamera } from "react-icons/im";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaBookmark } from "react-icons/fa6";
import PostDialog from "./PostDialog";
import { Link } from "react-router-dom"
import PostForm from "./PostForm";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPostForm, setIsPostForm] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
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
            <PostDialog open={isDialogOpen} setOpen={setDialogOpen} onAddPost={() => {
                setDialogOpen(false); 
                setIsPostForm(true); 
            }} />
            <PostForm open={isPostForm} setOpen={setIsPostForm}/>
            

            <div className="fixed top-0 left-0 z-50">
                {/* Wrapper to avoid misclicks */}
                <div className="relative z-10 md:hidden p-4">
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
                </div>

                {/* Sidebar */}
                <div
                    id="sidebar"
                    className={`fixed top-0 left-0 flex flex-col w-[18em] bg-[${_COLOR.less_light}] h-screen shadow-md transform ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none`}
                    onClick={(e) => e.stopPropagation()} // Prevents click inside from closing
                >
                    <div className={`p-4 flex items-center border-b border-[${_COLOR.more_light}]`}>
                        <div className="text-xl text-white font-bold heading">DropChat</div>
                    </div>
                    <div className="overflow-y-auto overflow-x-hidden flex-grow">
                        <ul className="flex flex-col py-4 space-y-1">
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`text-sm font-bold text-[${_COLOR.lightest}]`}>Menu</div>
                                </div>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <FaHome className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Home</span>
                                </Link>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/explore" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <MdExplore className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Explore</span>
                                </Link>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <a href="#" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <ImVideoCamera className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Shorts</span>
                                </a>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/messenger" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <IoChatboxEllipsesSharp className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
                                </Link>
                            </li>
                            {screenWidth < 768 && (
                                <li onClick={() => setIsOpen(false)}>
                                    <a href="#" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                        <FaSearch className="ml-4" />
                                        <span className="ml-2 text-sm tracking-wide truncate">Search</span>
                                    </a>
                                </li>
                            )}
                            <li onClick={() => setIsOpen(false)}>
                                <a href="#" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] pr-4 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}]pr-6`}>
                                    <FaBell className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                                    <span className="px-2 py-0.5 ml-auto text-xs font-medium text-red-500 bg-red-50 rounded-full">1.2k</span>
                                </a>
                            </li>
                            <div className={`mx-4 h-[1px] bg-[${_COLOR.more_light}]`}></div>
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`text-sm font-bold text-[${_COLOR.more_light}]`}>Settings</div>
                                </div>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <div onClick={() => setDialogOpen(true)} className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6 hover:cursor-pointer`}>
                                    <LuCircleFadingPlus className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Create Post</span>
                                </div>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/saved" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <FaBookmark className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Saved Posts</span>
                                </Link>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <a href="#" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <IoIosSettings className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
