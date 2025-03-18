import { useDispatch, useSelector } from "react-redux";
import { followUser, getUserByLimit, searchUser } from "../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

function Suggestions () {
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch ();

    const [search, setSearch] = useState (false);
    const [query, setQuery] = useState ();
    const [searchResult, setSearchResult] = useState ([]);
    const [follow, setFollow] = useState (false);

    function onChangeHandler(e){
        setQuery(e.target.value)
    }

    async function getUser () {
        await dispatch (getUserByLimit ({
            userId: authState.data?._id,
            limit: 7
        }));
    }

    function handleClickOutside (e) {
        const btn = document.getElementById('closeSearch');
        const area = document.getElementById('searchArea'); // Add an ID to your search area if it exists

        if (btn && !area?.contains(e.target)) {
            btn.click();
        }
    }

    const toggleFollow = async (userId) => {
        const response = await dispatch(followUser({
          id1: authState?.data?._id,
          id: userId,
        }));
        if (response.payload) {
          setFollow((prev) => !prev);
        }
      };

    useEffect (() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, [search])

    useEffect(() => {
            if(query?.trim()==""){
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
        getUser ();
    }, [follow])

    return (
        <section className={`fixed top-0 right-[1rem] flex-col md:flex-col overflow-auto w-full lg:max-w-sm rounded-md border-l-2 h-full pt-6`}>
            {search && <div id="searchArea" className={`h-full flex flex-col gap-2 px-8`}>
                <h2 className="text-xl font-bold">Search users</h2>
                <div className={`flex items-center border border-[${_COLOR.input}] rounded-md px-2 focus:shadow-md`}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`w-full p-2 bg-transparent text-[${_COLOR.text}] focus:outline-none`}
                        onChange={onChangeHandler}
                        name = "query"
                        value = {query}
                    />
                    <button id="closeSearch" onClick={() => {setSearch(false); setQuery("");}} className={`text-[${_COLOR.text}] text-2xl h-full`}>
                        <X />
                    </button>
                </div>
                <div className="border-b border-gray-600 mt-2"></div>
                <div className={`flex items-center space-x-2 text-[${_COLOR.text}] mt-2 text-sm`}>
                    Recent searches
                </div>
                <div className="mt-2">
                    {searchResult.map((user, index) => (
                        <div key={index} className={`text-[${_COLOR.text}] p-2 flex items-center space-x-2`}>
                            {user.image?.url ? 
                                <Avatar url = {user.image?.url}/> : 
                                <RxAvatar />
                                }
                            <Link to={`/profile/${user?.username}`} onClick={() => setSearch(false)}>
                                <p className={`text-[${_COLOR.text}] font-semibold hover:underline`}>{user.username}</p>
                                <div className={`text-sm text-[${_COLOR.text}] flex gap-1`}>
                                    <span>{user.name}</span> • <span>{user.follower?.length ? user.follower?.length : 'No'} follower{user.follower?.length <= 1 ? '' : 's'}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>}

            <div className={`px-8 text-[${_COLOR.text}] text-xl ${search ? 'hidden' : 'block'}`}>
                <div className={`flex justify-between items-center border-b pb-2`}>
                    <h2 className="font-bold">Friend Suggestions</h2>
                    <button className={`flex text-sm gap-2 items-center text-[${_COLOR.text}] rounded-full border border-[${_COLOR.text}] px-2`} onClick={() => setSearch (true)}>Search
                        <i className="fa-solid fa-magnifying-glass text-xs"></i>
                    </button>
                </div>
                {authState.userList?.map ((user, key) => (
                    <div key={key} className={`flex mt-2 gap-2 p-2 items-center border-b border-[${_COLOR.border}] hover:cursor-pointer hover:shadow-md`}>
                        <Avatar url={user.image?.url} size={"md"} />
                        <div className="flex justify-between w-full">
                            <Link to={`/profile/${user?.username}`} className="w-full">
                                <h2 className={`text-sm`}>{user.name}</h2>
                                <h2 className="text-xs font-extralight">@{user.username}</h2>
                            </Link>
                            <button className={`text-xs text-[${_COLOR.buttons}] rounded-full px-4`} onClick={() => toggleFollow (user._id)}>
                                {authState.data?.folowing?.includes (user._id) ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
        </section>
    )
}

export default Suggestions;