import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { searchUser } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";

function Suggestions ({ query, setUsername, showSuggestions, setShowSuggestions }) {
    const [suggestions, setSuggestions] = useState ([]);

    const dispatch = useDispatch ();

    async function getSuggestions (query) {
        const res = await dispatch (searchUser (query));
        setSuggestions (res.payload?.data?.userdata);
    }

    function selectUser (user) {
        setUsername (user.username);
        setShowSuggestions (false);
    }

    useEffect (() => {
        getSuggestions (query);
    }, [query])

    return (    
        <>      
            {showSuggestions && suggestions?.length > 0 && (
                <div className="bg-[var(--background)] rounded-sm p-2 flex flex-col z-50 w-[10rem]">
                    {suggestions.map((user, index) => (
                    <div 
                        key={index} 
                        className={`text-[var(--text)] p-2 py-3 flex items-center space-x-2 hover:shadow-md hover:cursor-pointer bg-[var(--card)] hover:text-[var(--heading)]`}
                        onClick={() => selectUser (user)}>
                        {user.image?.url ? 
                            <Avatar id={user._id} url = {user.image?.url} size={'sm'}/> : 
                            <RxAvatar />
                        }
                        <div className="flex flex-col items-start">
                            <p className={`font-semibold text-xs`}>{user.name}</p>
                            <div className={`text-xs`}>
                                {user.username}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default Suggestions;