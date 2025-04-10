import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import AddUser from "./AddUser";
import toast from "react-hot-toast";
import User from '../components/User'
import { FaSpinner } from "react-icons/fa";
import { getUserById } from "../redux/Slices/auth.slice";

function UpdateGroup ({ isOpen, setOpen }) {
    if (!isOpen) return null;

    const authState = useSelector ((state) => state.auth);
    const socket = useSelector ((state) => state.socket.socket);
    const liveGroup = useSelector ((state) => state.group.liveGroup);

    const dialogRef = useRef (null);
    const dispatch = useDispatch ();

    const [editName, setEditName] = useState (false);
    const [date, setDate] = useState ("");
    const [creator, setCreator] = useState ();
    const [addParticipants, setAddParticipants] = useState (false);
    const [nonParticipants, setNonParticipants] = useState ([]);
    const [selectedUsers, setSelectedUsers] = useState ([]);
    const [image, setImage] = useState ();
    const [groupName, setGroupName] = useState ();

    const defaultImage = "https://t3.ftcdn.net/jpg/12/81/12/20/240_F_1281122039_wYCRIlTBPzTUzyh8KrPd87umoo52njyw.jpg";

    function close () {
        setOpen (!isOpen);
    }

    async function getCreator () {
        const res = await dispatch (getUserById (liveGroup.admins[0]));
        setCreator (res.payload.data?.userdetails);
    }

    function getDate () {
        const date = new Date(liveGroup.createdAt);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        setDate (formattedDate);
    }

    function getNonParticipants () {
        const memberIds = liveGroup.members?.map(member => member.userId);
        const arr = authState.data?.follower?.filter(user => !memberIds.includes(user));

        setNonParticipants (arr);
    }

    function addGroupMembers () {
        try {
            // setLoading (true);

            const sendPayload = (encodedImage) => {
                const payload = {
                  _id: liveGroup._id,
                  members: selectedUsers,
                  admin: authState.data?._id,
                  image: encodedImage, // can be undefined
                };
            
                if (socket && socket.connected) {
                  socket.emit ("update-group", payload)
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
              
        } catch (error) {
            toast.error ('Something went wrong');
        } finally {
            // setLoading (false);
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

    useEffect (() => {
        getDate ();
        getCreator ();
        getNonParticipants ();
    }, []);

    console.log (selectedUsers)

    return (
        <>
            {isOpen && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[20]"></div>}
            <dialog ref={dialogRef} className="w-[30%] h-[80%] bg-[var(--background)] py-4">
                <button onClick={close} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[500]`}>✕</button>
                {!addParticipants ? <div className="flex flex-col gap-2">
                    <div className="relative w-20 h-20 mx-auto">
                        <img
                            src={defaultImage}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border object-cover"
                        />
                        
                        {/* Pencil overlay */}
                        <label
                            htmlFor="fileInput"
                            className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full cursor-pointer hover:bg-gray-600 px-2"
                            title="Change Profile Picture"
                        >
                            <i className="fa-solid fa-pencil text-[var(--heading)] text-sm w-4 h-4"></i>
                        </label>

                        {/* Hidden file input */}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            // onChange={handleFileChange}
                            encType="multipart/form-data"
                        />
                    </div>

                    <div className="flex justify-center w-full mt-2">
                        {!editName && <div className="flex justify-center items-center gap-4 w-full">
                            <h2 className="text-lg">{liveGroup.name}</h2>
                            <i className="fa-solid fa-pencil text-[var(--heading)] text-sm hover:cursor-pointer" onClick={() => setEditName (true)}></i>
                        </div>}
                        {editName && <div className="w-[60%] px-4">
                            <input
                                name="name"
                                // value={groupName}
                                // onChange={(e) => setGroupName (e.target.value)}
                                className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-transparent border`}
                                type="text"
                                autoComplete="false" autoCorrect="false" spellCheck="false"
                                placeholder="Group name"
                                required
                            />
                        </div>}
                    </div>

                    <h2 className="flex justify-center w-full text-sm font-extralight">
                        {liveGroup.members?.length} members
                    </h2>

                    <h2 className="flex justify-center w-full text-sm font-extralight">
                        Created by {creator?.username} on {date}
                    </h2>

                    <div className="flex flex-col w-full px-4">
                        <div className={`flex items-center w-full rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                            <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                            <input
                                type="text"
                                placeholder="Search participants ..."
                                className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                                // onChange={onChangeHandler}
                                name = "query"
                                // value = {query}
                            />
                            <button className={`text-[var(--text)] text-2xl h-full`}>
                                <X />
                            </button>
                        </div>
                        <div className="flex flex-col max-h-[20rem] overflow-y-auto pr-2">
                            <div 
                                className="flex items-center bg-transparent hover:shadow-md hover:cursor-pointer rounded-md hover:bg-[var(--topic)] p-2 px-4"
                                onClick={() => setAddParticipants (true)}
                            >
                                <i className="fa-solid fa-user-plus flex items-center justify-center rounded-full object-cover"></i>
                                <div className="ml-2 w-full">Add particpiants</div>
                            </div>
                            {liveGroup.members?.length > 0 ? liveGroup.members?.map ((user, index) => (
                            <User chat={user.userId} type={'follower'} key={index}/>
                            )) : <h2>No participants</h2>}
                        </div>
                    </div>
                </div> :
                <div className="relative flex flex-col gap-2 px-4 h-full">
                    <div className={`flex items-center w-full rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                        <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                        <input
                            type="text"
                            placeholder="Search participants ..."
                            className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                            // onChange={onChangeHandler}
                            name = "query"
                            // value = {query}
                        />
                        <button className={`text-[var(--text)] text-2xl h-full`}>
                            <X />
                        </button>
                    </div>
                    {nonParticipants?.length > 0 ? nonParticipants?.map ((user, key) => (
                        <AddUser userId={user} members={selectedUsers} setMembers={setSelectedUsers} key={key}/>
                    )) : <h2>No followers to add</h2>}

                    <div onClick={addGroupMembers} className="absolute bottom-4 w-full flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold text-[var(--buttonText)] bg-[var(--buttons)] p-2 rounded-md w-[60%] text-center">Add selected users</h2>
                    </div>
                </div>}
            </dialog>
        </>
    )
}

export default UpdateGroup;