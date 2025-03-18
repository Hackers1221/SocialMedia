import { useDispatch, useSelector } from "react-redux";
import { getUserByLimit, searchUser } from "../redux/Slices/auth.slice";
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

    function onChangeHandler(e){
        setQuery(e.target.value)
    }

    async function getUser () {
        await dispatch (getUserByLimit ({
            userId: authState.data?._id,
            limit: 7
        }));
    }

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
    }, [authState.data?.token])

    return (
        <section className={`fixed top-0 right-[1rem] flex-col md:flex-col overflow-auto w-full lg:max-w-sm rounded-md border-l border-[${_COLOR.text}] h-full pt-6`}>
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
                                    <span>{user.name}</span> • <span>{user.followers?.length() ? user.followers?.length() : 0} followers</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>}

            <div className={`px-8 font-bold text-[${_COLOR.text}] text-xl ${search ? 'hidden' : 'block'}`}>
                <div className={`flex justify-between items-center`}>
                    <h2>Friend Suggestions</h2>
                    <button className={`flex text-sm gap-2 items-center text-[${_COLOR.buttons}]`} onClick={() => setSearch (true)}>Search
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                {authState.userList?.map ((user, key) => (
                    <Link to={`/profile/${user?.username}`} key={key} className={`flex mt-2 gap-2 p-2 items-center border-b border-[${_COLOR.border}] hover:cursor-pointer hover:shadow-md`}>
                        <Avatar url={user.image?.url} size={"md"} />
                        <div>
                            <h2 className={`text-sm`}>{user.name}</h2>
                            <h2 className="text-xs font-extralight">@{user.username}</h2>
                        </div>
                    </Link>
                ))}
            </div>
            
        </section>
    )
}

export default Suggestions;