import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import toast from "react-hot-toast";
import SkeletonPostCard from "../../components/SkeletonPostCard";
import { filterVerseByFollowing, filterVerseByLiked, getAllVerse } from "../../redux/Slices/verse.slice";
import VerseCard from "../../components/VerseCard";
import VerseForm from "../../components/VerseForm";

function VersePage() {
    const authState = useSelector ((state) => state.auth);
    const verseState = useSelector ((state) => state.verse);

    const dispatch = useDispatch ();

    const [isLoading, setIsLoading] = useState (false);
    const [selected, setSelected] = useState ("All");
    const [text, setText] = useState ("");
    const [isOpen, setIsOpen] = useState (false);

    const options = ["All", "Following", "Liked"]

    async function getVerse () {
        setIsLoading(true);
        try {
            const res = await dispatch (getAllVerse ());
            console.log (res);
        } catch {
            toast.error ("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function optionChange (option) {
        setSelected (option);
        if (option === "Liked") await dispatch( filterVerseByLiked ({id : authState?.data?._id}));
        if (option === "Following") await dispatch( filterVerseByFollowing ({following : authState?.data?.following}));
        if (option === "All") await dispatch (getAllVerse ());
    }

    useEffect (() => {
        getVerse ();
    }, [])

    return (
        <>
            <div className="fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[82vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto">                
                {/* Input Box */}
                <div className={`w-full mb-4 rounded-md py-8 flex justify-center gap-2 bg-black/20 px-4`}>
                    <Avatar url={authState.data?.image?.url} />
                    <div className="flex flex-col items-end w-full">
                        <input 
                            type="text" 
                            placeholder="What's happening?" 
                            value={text}
                            className={`w-full p-2 bg-transparent border border-[${_COLOR.less_light}] rounded-md focus:outline-none text-white`} 
                            onChange={(e) => setText (e.target.value)}/>
                        <div className="flex gap-2">
                            <button 
                                className={`mt-2 px-6 py-2 bg-transparent border border-[${_COLOR.less_light}] hover:bg-[${_COLOR.lightest}] hover:text-black text-white rounded-full`}
                                onClick={() => setText ("")}>
                                    Clear
                            </button>
                            <button 
                                className={`mt-2 px-6 py-2 bg-transparent border border-[${_COLOR.less_light}] hover:bg-[${_COLOR.lightest}] hover:text-black text-white rounded-full`}
                                onClick={() => setIsOpen (true)}>
                                    Post
                            </button>
                        </div>
                    </div>
                </div>

                <VerseForm open={isOpen} setOpen={setIsOpen} initialText={text}/>

                <div className="flex justify-between items-center">
                    <h2 className={`text-[${_COLOR.lightest}] font-bold text-[1.5rem]`}>Recent Verse</h2>
                    <div className="flex gap-4">
                        {options?.map ((option, index) => {
                           return (<h2 
                            key={index} 
                            className={`${ selected === option ? `text-[${_COLOR.lightest}]` : `text-[${_COLOR.less_light}]` // Default color
                            } font-bold text-[1rem] hover:cursor-pointer`} 
                            onClick={() => optionChange(option)}>{option}</h2>)
                        })}
                    </div>
                </div>

                {/* Scrollable Post List */}
                {isLoading && <SkeletonPostCard />}
                {!isLoading && <div className="pt-4 w-full h-screen">
                    {verseState?.verseList?.length > 0 ? verseState?.verseList?.map((verse, key) => (
                        <VerseCard verse={verse} key={key}/>
                    )) : <h2 className='w-full text-center font-extralight text-white'>No verses to show</h2>}
                </div>}
            </div>
        </>
    )
}
export default VersePage;