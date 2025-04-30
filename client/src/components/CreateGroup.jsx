import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import AddUser from "./AddUser";
import toast from "react-hot-toast";
import User from '../components/User'
import { FaSpinner } from "react-icons/fa";
import { getFollowerDetails, searchFollower } from "../redux/Slices/auth.slice";

function CreateGroup ({ isOpen, setOpen }) {
    if (!isOpen) return null;

    const authState = useSelector ((state) => state.auth);
    const socket = useSelector ((state) => state.socket.socket);

    const dialogRef = useRef (null);
    const dispatch = useDispatch ();

    const [members, setMembers] = useState ([{
        id: authState.data?._id,
        addedBy: authState.data?._id
    }]);
    const [groupEdit, setGroupEdit] = useState (false);
    const [groupName, setGroupName] = useState ("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState ();
    const [imageUrl, setImageUrl] = useState ("");
    const [query , setQuery] = useState("");
    const [followers,setFollowers] = useState();
    const [queriedFollowers,setQueriedFollowers] = useState();


    const defaultImage = "https://t3.ftcdn.net/jpg/12/81/12/20/240_F_1281122039_wYCRIlTBPzTUzyh8KrPd87umoo52njyw.jpg";

    function close () {
        setMembers([]);
        setOpen (!isOpen);
    }

    const handleFileChange = (e) => {
        setImageUrl (URL.createObjectURL(e.target.files[0]));
        setImage (e.target.files[0]);
    };

    function goNext () {
        if (members.length <= 2) {
            toast.error ('Select atleast 2 members'); return;
        }

        setGroupEdit (true);
    }

    function goBack () {
        setGroupEdit (false);
    }

    async function submit () {
        try {
            setLoading (true);

            if (groupName?.trim()) {
                const sendPayload = (encodedImage) => {
                  const payload = {
                    admin: [authState.data?._id],
                    creator: authState.data.username,
                    members: members,
                    name: groupName.trim(),
                    image: encodedImage, // can be undefined
                  };
              
                  if (socket && socket.connected) {
                    socket.emit("create-group", payload);
                  }
              
                  setGroupName("");
                  setImage(undefined);
                };
              
                if (image) {
                  const reader = new FileReader();
              
                  reader.onload = () => {
                    const encodedFile = {
                      name: image.name,
                      type: image.type,
                      data: reader.result,
                    };
                    sendPayload(encodedFile);
                  };
              
                  reader.onerror = (error) => {
                    console.error("File reading error:", error);
                  };
              
                  reader.readAsDataURL(image);
                } else {
                  sendPayload();
                }
              }
              
        } catch (error) {
            toast.error ('Something went wrong');
        } finally {
            setLoading (false);
            close ();
        }
    }

    useEffect (() => {
        if (isOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
        else if (!isOpen && dialogRef.current?.open) {
            dialogRef.current.close();
        }

    }, [isOpen]);

    const onChangeHandler = (e) => {
        const value = e.target.value;
        setQuery(value);
    }

    const getDetails = async() => {
        const response = await dispatch(getFollowerDetails(authState.data._id));
        setFollowers(response.payload?.data?.userdata);
        setQueriedFollowers(response.payload?.data?.userdata);
    }

    useEffect(() => {
        getDetails();
    },[])

    useEffect(() => {
        if(query.trim()==""){
          setQueriedFollowers(followers);
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await dispatch(searchFollower({
                    userId : authState.data._id,
                    q : query
                }));
                setQueriedFollowers(response.payload?.data?.userdata);
            } catch (error) {
                console.error("Search failed:", error);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
      },[query])

    return (
        <>
            {isOpen && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[20]"></div>}
            <dialog ref={dialogRef} className="w-[30%] h-[80%] bg-[var(--background)]">
                <button onClick={close} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[500]`}>✕</button>
                {!groupEdit && <div className="relative flex justify-center h-full w-full">
                    <div className="p-4 w-full">
                        <h2 className="font-bold text-md">Create group</h2>
                        <div className={`flex items-center rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                            <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                            <input
                                type="text"
                                placeholder="Search people, groups and messages"
                                className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                                onChange={onChangeHandler}
                                name = "query"
                                value = {query}
                            />
                            <button className={`text-[var(--text)] text-2xl h-full`}>
                                <X />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {queriedFollowers?.map ((user, key) => (
                                <AddUser userId={user._id} username={user.username} image = {user.image} members={members} setMembers={setMembers} key={key}/>
                            ))}
                        </div>
                    </div>
                    <div onClick={goNext} className="absolute bottom-4 bg-[var(--buttons)] w-[80%] flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold text-[var(--buttonText)]">Next</h2>
                    </div>
                </div>}
                {groupEdit && <div className="relative h-full w-full p-4">
                    <div className="w-full flex justify-start items-center">
                        <i className="fa-solid fa-arrow-left hover:cursor-pointer" onClick={goBack}></i>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <img
                        src={imageUrl || defaultImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border object-cover"
                        />
                        <div className="flex justify-center items-center w-full">
                            <input
                                type="file"
                                accept="image/*"
                                className={`px-4 py-2 border-[var(--border)] rounded-md text-sm text-[var(--text)] font-medium`}
                                onChange={handleFileChange}
                                encType= "multipart/form-data"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            Group name
                        </label>
                        <input
                            name="name"
                            value={groupName}
                            onChange={(e) => setGroupName (e.target.value)}
                            className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-transparent border`}
                            type="text"
                            autoComplete="false" autoCorrect="false" spellCheck="false"
                            placeholder="Group name"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <h2 className="font-semibold mb-2">Added Participants</h2>
                        {members.map ((user, index) => (
                            <User chat={user.id} type={'follower'} key={index}/>
                        ))}
                    </div>
                    <div onClick={submit} className="absolute bottom-4 bg-[var(--buttons)] w-[90%] flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold text-[var(--buttonText)]">{loading ? (
                            <FaSpinner className="animate-spin mr-2" />
                        ) : (
                            "Submit"
                        )}</h2>
                    </div>
                </div>}
            </dialog>
        </>
    )
}

export default CreateGroup;