import { FaHome } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { LuCircleFadingPlus } from "react-icons/lu";
import { ImVideoCamera } from "react-icons/im";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

function Sidebar () {

    const [isOpen, setIsOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isOpen && screenWidth < 768) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isOpen, screenWidth]);


    return (
        <>
            {/* Hamburger Icon for Smaller Devices */}
            <div className="md:hidden p-4 z-50 relative">
                {isOpen ? (
                    <IoMdClose
                        className="text-3xl cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />
                ) : (
                    <GiHamburgerMenu
                        className="text-3xl cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Sidebar */}
            <div className={`fixed flex flex-col top-0 left-0 w-64 bg-[${_COLOR.less_light}] h-screen border-rtransform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none`} onClick={(e) => e.stopPropagation()} >
                <div className={`py-4 flex items-center justify-center border-b border-[${_COLOR.more_light}]`}>
                    <div className="text-xl cursive-text">DropChat</div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                <ul className="flex flex-col py-4 space-y-1">
                    <li className="px-5">
                    <div className="flex flex-row items-center h-8">
                        <div className={`text-sm font-bold tracking-wide text-[${_COLOR.dark}]`}>Menu</div>
                    </div>
                    </li>
                    <li>
                    <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <FaHome />
                        <span className="ml-2 text-sm tracking-wide truncate">Home</span>
                    </a>
                    </li>
                    <li>
                    <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <MdExplore />
                        <span className="ml-2 text-sm tracking-wide truncate">Explore</span>
                    </a>
                    </li>
                    <li>
                    <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <ImVideoCamera />
                        <span className="ml-2 text-sm tracking-wide truncate">Shorts</span>
                    </a>
                    </li>
                    <li>
                    <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <IoChatboxEllipsesSharp />
                        <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
                    </a>
                    </li>
                    {screenWidth < 768 && (
                        <li>
                        <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                            <span className="inline-flex justify-center items-center ml-4">
                            </span>
                            <FaSearch />
                            <span className="ml-2 text-sm tracking-wide truncate">Search</span>
                        </a>
                    </li>
                    )}
                    <li>
                    <a href="#" className={`relative mb-4 flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6 `}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <FaBell />
                        <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                        <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">1.2k</span>
                    </a>
                    </li>
                    <div className={`mx-4 h-[1px] bg-[${_COLOR.more_light}]`}></div>
                    <li className="px-5">
                        <div className="flex flex-row items-center h-8">
                            <div className={`text-sm font-bold tracking-wide text-[${_COLOR.dark}]`}>Settings</div>
                        </div>
                    </li>
                    {screenWidth < 768 && (
                        <li>
                            <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                                <span className="inline-flex justify-center items-center ml-4">
                                </span>
                                <IoPerson />
                                <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
                            </a>
                        </li>
                    )}
                    <li>
                    <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <LuCircleFadingPlus />
                        <span className="ml-2 text-sm tracking-wide truncate">Create Post</span>
                    </a>
                    </li>
                    <li>
                    <a href="#" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.dark}] pr-6`}>
                        <span className="inline-flex justify-center items-center ml-4">
                        </span>
                        <IoIosSettings />
                        <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                    </a>
                    </li>
                </ul>
                </div>
            </div>
        </>
    )
}

export default Sidebar;