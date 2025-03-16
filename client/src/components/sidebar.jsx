import { FaHome, FaUserCircle } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { FaBell, FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { LuCircleFadingPlus } from "react-icons/lu";
import { ImVideoCamera } from "react-icons/im";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBookmark } from "react-icons/fa6";
import PostDialog from "./PostDialog";
import { Link, useNavigate } from "react-router-dom"
import PostForm from "./PostForm";
import PulseForm from "./PulseForm";
import { useDispatch, useSelector } from "react-redux";
import { logout, searchUser } from "../redux/Slices/auth.slice";
import { IoMdPulse } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { Search, X } from "lucide-react";
import Avatar from "./Avatar";
import { RxAvatar } from "react-icons/rx";

function Sidebar() {

    const authState = useSelector ((state) => state.auth);

    const [isOpen, setIsOpen] = useState(false);
    const [isPostForm, setIsPostForm] = useState(false);
    const [isPulseForm, setIsPulseForm] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [searchresult,setSearchresult] = useState([]);
    const [query,SetQuery] = useState("");
    const [search , setSearch] = useState(false); 

    const recentSearches = [
        { username: "code_master", realName: "Aryan Singh", followers: 890 },
        { username: "hacker_99", realName: "Neha Sharma", followers: 1200 },
        { username: "tech_guru", realName: "Ravi Patel", followers: 5000 }
    ];


    const dispatch = useDispatch ();
    const navigate = useNavigate ();

    async function onLogout () {
        await dispatch (logout ());
        navigate ("/login"); return;
    }

    const searchHandler = () => {
        setSearch(!search);
    }

    useEffect (() => {
        if (!authState?.isLoggedIn || !authState?.data?.email) {
            navigate ("/login"); return;
        }
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    function onChangeHandler(e){
        SetQuery(e.target.value)
    }

    useEffect(() => {
        if(query.trim()==""){
            setSearchresult([]);
            return;
        }
        // Set a timeout to wait before making the API call
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await dispatch(searchUser(query));
                setSearchresult(response.payload?.data?.userdata);
            } catch (error) {
                console.error("Search failed:", error);
            }
        }, 300); // 300ms debounce delay
        return () => clearTimeout(delayDebounceFn);
    },[query])

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
                {!search ?  (<div
                    id="sidebar"
                    className={`fixed top-0 left-0 flex flex-col w-[18em] bg-black bg-opacity-[40%] h-screen shadow-md transform ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none`}
                    onClick={(e) => e.stopPropagation()} // Prevents click inside from closing
                >
                    <div className={`p-4 flex items-center`}>
                        <div className={`text-xl text-white font-bold heading`}>Drop</div>
                        <div className="text-xl text-white font-bold heading">Chat</div>
                    </div>
                    <div className="overflow-y-auto overflow-x-hidden flex-grow">
                        <ul className="flex flex-col py-4 space-y-1">
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <FaHome className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Feed</span>
                                </Link>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to={`/profile/${authState?.data?.username}`} className={`relative flex items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6 pl-4`}>
                                    <Avatar url={authState?.data?.image?.url} size={"sm"}/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
                                </Link>
                            </li>
                        </ul>
                        <div className={`mx-4 h-[1px] bg-[${_COLOR.lightest}]`}></div>
                        <ul className="flex flex-col py-4 space-y-1">
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`text-sm font-bold text-[${_COLOR.lightest}]`}>Menu</div>
                                </div>
                            </li>
                            <li className="hover:cursor-pointer" onClick={() => setSearch(true)}>
                                <div className="relative flex flex-row items-center h-11 hover:bg-gray-200 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-400 pr-6">
                                    <FiSearch className="ml-4"/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Search</span>
                                </div>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/explore" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <MdExplore className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Explore</span>
                                </Link>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <Link to="/pulse" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <IoMdPulse className="ml-4"/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Pulse</span>
                                </Link>
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
                            <div className={`mx-4 h-[1px] bg-[${_COLOR.lightest}]`}></div>
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`text-sm font-bold text-[${_COLOR.lightest}]`}>Settings</div>
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
                                <Link to="/settings" className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6`}>
                                    <IoIosSettings className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                                </Link>
                            </li>
                            <li onClick={onLogout}>
                                <div className={`relative flex flex-row items-center h-11 hover:bg-gray-200 text-[${_COLOR.lightest}] hover:text-gray-800 border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6 hover:cursor-pointer`}>
                                    <i className="fa-solid fa-power-off ml-4 text-[#ED4956]"></i>
                                    <span className="ml-2 text-sm tracking-wide truncate text-[#ED4956]">Logout</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>) : 

                /* Search button */

                (<div className="fixed top-0 left-0 w-[18em] bg-black bg-opacity-[40%] h-screen flex flex-col p-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 rounded-md bg-gray-700 text-white outline-none"
                            onChange={onChangeHandler}
                            name = "query"
                            value = {query}
                        />
                        <button onClick={() => setSearch(false)} className="text-white text-2xl">
                            <X />
                        </button>
                    </div>
                    <div className="border-b border-gray-600 mt-2"></div>
                    <div className="flex items-center space-x-2 text-white mt-2 text-sm">
                        Recent searches
                    </div>
                    <div className="mt-2">
                        {searchresult.map((user, index) => (
                            <div key={index} className="text-white p-2 flex items-center space-x-2">
                                {user.image?.url ? 
                                    <Avatar url = {user.image?.url}/> : 
                                    <RxAvatar />
                                 }
                                <Link to={`/profile/${user?.username}`} onClick={() => setSearch(false)}>
                                    <p className="font-semibold hover:underline">{user.username}</p>
                                    <div className="text-sm text-gray-300 flex gap-1">
                                        <span>{user.name}</span> • <span>{user.followers?.length() ? user.followers?.length() : 0} followers</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>)    
                
            }                
                
            </div>
        </>
    );
}

export default Sidebar;
