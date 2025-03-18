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
import VerseForm from "./VerseForm";

function Sidebar() {

    const authState = useSelector ((state) => state.auth);

    const [isOpen, setIsOpen] = useState(false);
    const [isPostForm, setIsPostForm] = useState(false);
    const [isPulseForm, setIsPulseForm] = useState(false);
    const [isVerseForm, setIsVerseForm] = useState (false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [searchresult,setSearchresult] = useState([]);
    const [query,SetQuery] = useState("");
    const [search , setSearch] = useState(false); 
    const [selected, setSelected] = useState ('Feed');

    const dispatch = useDispatch ();
    const navigate = useNavigate ();

    

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

    function handleClickOutside (e) {
        const btn = document.getElementById('closeSearch');
        const area = document.getElementById('searchArea'); // Add an ID to your search area if it exists

        if (btn && !area?.contains(e.target)) {
            btn.click();
        }
    }

    useEffect (() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, [search])

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
                onAddVerse={() => {
                    setDialogOpen(false);
                    setIsVerseForm (true);
                }}
            />
            <PostForm open={isPostForm} setOpen={setIsPostForm}/>
            <PulseForm open={isPulseForm} setOpen={setIsPulseForm} />
            <VerseForm open={isVerseForm} setOpen={setIsVerseForm} />


            
            

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
                    className={`fixed top-0 left-0 flex flex-col w-[18em] bg-[${_COLOR.card}] h-screen shadow-md transform ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none border-r-2`}
                    onClick={(e) => e.stopPropagation()} // Prevents click inside from closing
                >
                    <div className={`p-4 flex items-center`}>
                        <div className={`text-2xl font-bold heading text-[${_COLOR.buttons}]`}>Drop</div>
                        <div className={`text-3xl font-bold heading text-[${_COLOR.buttons}]`}>Chat</div>
                    </div>
                    <div className="overflow-y-auto overflow-x-hidden flex-grow">
                        <ul className="flex flex-col py-4 space-y-1">
                            <li onClick={() => {setIsOpen(false); setSelected('Feed')}}>
                                <Link to="/" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Feed' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <FaHome className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Feed</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Profile')}}>
                                <Link to={`/profile/${authState?.data?.username}`} className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pl-4 ${selected === 'Profile' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <Avatar url={authState?.data?.image?.url} size={"sm"}/>
                                    <span className="ml-2 text-sm tracking-wide truncate">{authState.data?.username}</span>
                                </Link>
                            </li>
                        </ul>
                        <div className={`mx-4 h-[0.5px] bg-[${_COLOR.text}]`}></div>
                        <ul className="flex flex-col py-4 space-y-1">
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`text-sm font-bold text-[${_COLOR.text}]`}>Menu</div>
                                </div>
                            </li>
                            <li className="hover:cursor-pointer" onClick={() => setSearch(true)}>
                                <div className={`relative flex flex-row items-center h-11 border-l-4 border-transparent hover:border-[${_COLOR.buttons}] hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold pr-6 text-[${_COLOR.text}]`}>
                                    <FiSearch className="ml-4"/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Search</span>
                                </div>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Explore')}}>
                            <Link to="/explore" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Explore' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <MdExplore className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Explore</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Pulse')}}>
                            <Link to="/pulse" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Pulse' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <IoMdPulse className="ml-4"/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Pulse</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Verse')}}>
                            <Link to="/verse" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Verse' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <i className="fa-regular fa-comments ml-4 text-sm"/>
                                    <span className="ml-2 text-sm tracking-wide truncate">Verse</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Messages')}}>
                                <Link to="/messenger" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Messages' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <IoChatboxEllipsesSharp className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
                                </Link>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <a href="#" className={`relative flex flex-row border-l-4 border-transparent hover:border-[${_COLOR.buttons}] items-center h-11 text-[${_COLOR.text}] hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold pr-4 border-l-4 border-transparent hover:border-[${_COLOR.more_light}]pr-6`}>
                                    <FaBell className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                                    <span className="px-2 py-0.5 ml-auto text-xs font-medium text-red-500 bg-red-50 rounded-full">1.2k</span>
                                </a>
                            </li>
                            <div className={`mx-4 h-[1px] bg-[${_COLOR.text}]`}></div>
                            <li className="px-5">
                                <div className="flex flex-row items-center h-8">
                                    <div className={`text-sm font-bold text-[${_COLOR.text}]`}>Settings</div>
                                </div>
                            </li>
                            <li onClick={() => setIsOpen(false)}>
                                <div onClick={() => setDialogOpen(true)} className={`relative flex flex-row border-l-4 border-transparent hover:border-[${_COLOR.buttons}] items-center h-11 text-[${_COLOR.text}] hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 border-transparent hover:border-[${_COLOR.more_light}] pr-6 hover:cursor-pointer`}>
                                    <LuCircleFadingPlus className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Create Post</span>
                                </div>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Saved')}}>
                                <Link to="/saved" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Saved' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <FaBookmark className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Saved Posts</span>
                                </Link>
                            </li>
                            <li onClick={() => {setIsOpen(false); setSelected('Settings')}}>
                                <Link to="/settings" className={`relative border-l-4 hover:border-[${_COLOR.buttons}] flex flex-row items-center h-11 hover:text-[${_COLOR.buttons}] hover:shadow-md font-semibold border-l-4 pr-6 ${selected === 'Settings' ? `border-[${_COLOR.buttons}] text-[${_COLOR.buttons}] shadow-md` : `border-transparent text-[${_COLOR.text}]`}`}>
                                    <IoIosSettings className="ml-4" />
                                    <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>) : 

                /* Search button */

                (<div id="searchArea" className={`fixed top-0 left-0 w-[18em] bg-[${_COLOR.background}] h-screen flex flex-col p-4`}>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`w-full p-2 rounded-md bg-transparent text-[${_COLOR.text}] border border-[${_COLOR.input}] focus:shadow-md focus:outline-none`}
                            onChange={onChangeHandler}
                            name = "query"
                            value = {query}
                        />
                        <button id="closeSearch" onClick={() => setSearch(false)} className={`text-[${_COLOR.text}] text-2xl`}>
                            <X />
                        </button>
                    </div>
                    <div className="border-b border-gray-600 mt-2"></div>
                    <div className={`flex items-center space-x-2 text-[${_COLOR.text}] mt-2 text-sm`}>
                        Recent searches
                    </div>
                    <div className="mt-2">
                        {searchresult.map((user, index) => (
                            <div key={index} className={`text-[${_COLOR.text}] p-2 flex items-center space-x-2`}>
                                {user.image?.url ? 
                                    <Avatar url = {user.image?.url}/> : 
                                    <RxAvatar />
                                 }
                                <Link to={`/profile/${user?.username}`} onClick={() => setSearch(false)}>
                                    <p className={`text-[${_COLOR.text}] font-semibold hover:underline`}>{user.username}</p>
                                    <div className={`text-sm text-[${_COLOR.text}] flex gap-1`}>
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
