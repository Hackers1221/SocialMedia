import { useDispatch, useSelector } from "react-redux";
import { followUser, getUserById, getUserByLimit, searchUser } from "../redux/Slices/auth.slice";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function Suggestions () {
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch ();

    const [search, setSearch] = useState (false);
    const [query, setQuery] = useState ();
    const [searchResult, setSearchResult] = useState ([]);
    const [follow, setFollow] = useState (false);
    const [followers, setFollowers] = useState ([]);
    const [check, setCheck] = useState (0);

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

    const toggleFollow = async (user) => {
        const response = await dispatch(followUser({
          id1: authState?.data?._id,
          id: user._id,
        }));
        if (response.payload) {
          setFollow((prev) => !prev);
          toast.success(`Followed ${user.name} successfully`);
        }
      };

    async function getFollowers () {
        authState.data?.following?.map (async (userId) => {
            const res = await dispatch (getUserById (userId));
            console.log (res)
            setFollowers((prev) => [...prev, res.payload?.data?.userdetails]);
        })
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
        setFollowers([]);
        getUser ();
        getFollowers ();
    }, [])

    return (
        <section className={`fixed top-0 right-[1rem] flex-col md:flex-col overflow-auto w-full lg:max-w-sm h-full pt-6`}>
            <div className={`flex flex-col gap-2 ml-8`}>
                <div className={`bg-transparent`}>
                    <div className={`flex items-center rounded-md px-4 my-4 mx-2 shadow-md border border-[${_COLOR.text}]`}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search users"
                            className={`w-full p-2 bg-transparent text-[${_COLOR.text}] focus:outline-none`}
                            onChange={onChangeHandler}
                            name = "query"
                            value = {query}
                        />
                        {query && <button onClick={() => setQuery ("")} className={`text-[${_COLOR.text}] text-2xl h-full`}>
                            <X />
                        </button>}
                    </div>
                    {/* {query?.length == 0 && <div className={`flex items-center space-x-2 text-[${_COLOR.text}] mt-2 mx-2 text-sm`}>
                        Recent searches
                    </div>} */}
                    <div>
                        {searchResult.map((user, index) => (
                            <Link to={`/profile/${user?.username}`} key={index} className={`text-[${_COLOR.text}] mt-2 p-2 py-3 flex items-center space-x-2 hover:shadow-md hover:cursor-pointer bg-[${_COLOR.card}]`}>
                                {user.image?.url ? 
                                    <Avatar url = {user.image?.url} size={'md'}/> : 
                                    <RxAvatar />
                                    }
                                <div>
                                    <p className={`text-[${_COLOR.text}] font-semibold text-sm`}>{user.name}</p>
                                    <div className={`text-xs text-[${_COLOR.text}] flex gap-1`}>
                                        <span>{user.username}</span> • <span>{user.follower?.length ? user.follower?.length : 'No'} follower{user.follower?.length <= 1 ? '' : 's'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {check == 0 && <div className={`ml-8 text-[${_COLOR.text}] text-xl rounded-xl bg-[${_COLOR.card}] shadow-lg mt-8`}>
                <div className={`flex justify-between items-center border-b bg-[#B9D9EB] rounded-t-xl p-2`}>
                    <h2 className="font-bold text-sm">Friend Suggestions</h2>
                </div>
                {authState.userList?.map ((user, key) => (
                    <div key={key} className={`flex mt-2 gap-2 p-2 py-3 items-center border-b ${key === authState.userList?.length - 1 ? 'border-transparent' : 'border-[${_COLOR.border}]'} hover:cursor-pointer hover:shadow-md`}>
                        <Avatar url={user.image?.url} size={"md"} />
                        <div className="flex justify-between w-full">
                            <Link to={`/profile/${user?.username}`} className="w-full">
                                <h2 className={`text-sm`}>{user.name}</h2>
                                <h2 className="text-xs font-extralight">@{user.username}</h2>
                            </Link>
                            <button className={`text-xs text-[${_COLOR.buttons}] rounded-full px-4 hover:font-semibold`} onClick={() => toggleFollow (user)}>
                                Follow
                            </button>
                        </div>
                    </div>
                ))}
            </div>}

            {check == 0 && followers?.length > 0 && <div className={`ml-8 text-[${_COLOR.text}] text-xl rounded-xl bg-[${_COLOR.card}] mt-8 shadow-lg`}>
                <div className={`flex justify-between items-center border-b bg-[#B9D9EB] rounded-t-xl p-2`}>
                    <h2 className="font-bold text-sm">Your followers</h2>
                </div>
                {followers?.map ((user, key) => (
                    <div key={key} className={`flex mt-2 gap-2 p-2 py-3 items-center border-b ${key === authState.userList?.length - 1 ? 'border-transparent' : 'border-[${_COLOR.border}]'} hover:cursor-pointer hover:shadow-md`}>
                        <Avatar url={user?.image?.url} size={"md"} />
                        <div className="flex justify-between w-full">
                            <Link to={`/profile/${user?.username}`} className="w-full">
                                <h2 className={`text-sm`}>{user?.name}</h2>
                                <h2 className="text-xs font-extralight">@{user?.username}</h2>
                            </Link>
                            <button className={`text-xs text-[${_COLOR.buttons}] rounded-full px-4 hover:font-semibold`} onClick={() => toggleFollow (user)}>
                                Follow
                            </button>
                        </div>
                    </div>
                ))}
            </div>}
            
        </section>
    )
}

export default Suggestions;