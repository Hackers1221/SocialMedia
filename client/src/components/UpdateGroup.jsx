import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import AddUser from "./AddUser";
import toast from "react-hot-toast";
import User from '../components/User'
import { getUserById } from "../redux/Slices/auth.slice";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

function UpdateGroup ({ isOpen, setOpen, isDelete, setDelete }) {
    if (!isOpen) return null;

    const authState = useSelector ((state) => state.auth);
    const socket = useSelector ((state) => state.socket.socket);
    const liveGroup = useSelector ((state) => state.group.liveGroup);

    const dialogRef = useRef (null);

    const [editName, setEditName] = useState (false);
    const [date, setDate] = useState ("");
    const [addParticipants, setAddParticipants] = useState (false);
    const [nonParticipants, setNonParticipants] = useState ([]);
    const [selectedUsers, setSelectedUsers] = useState ([]);
    const [image, setImage] = useState ();
    const [groupName, setGroupName] = useState (liveGroup?.name);
    const [imageUrl, setImageUrl] = useState (liveGroup?.image?.url);

    const defaultImage = "https://t3.ftcdn.net/jpg/12/81/12/20/240_F_1281122039_wYCRIlTBPzTUzyh8KrPd87umoo52njyw.jpg";

    function getDate () {
        const date = new Date(liveGroup.createdAt);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        setDate (formattedDate);
    }

    function getNonParticipants () {
        const memberIds = liveGroup.members?.map(member => member.userId);
        let arr = authState.data?.follower?.filter(user => !memberIds.includes(user));
        const inactiveMembers = liveGroup.members
            .filter(member => !member.isActive)
            .map(member => member.userId);
        
        arr = [...arr, ...inactiveMembers];

        setNonParticipants (arr);
    }

    function onLeaveGroup () {
        if (socket && socket.connected) {
            socket.emit ("leave-group", {
                _id: liveGroup._id,
                userId: authState.data?._id
            })
        }
    }

    function submitDetails () {
        try {
            // setLoading (true);

            const sendPayload = (encodedImage) => {
                const payload = {
                  _id: liveGroup._id,
                  members: selectedUsers,
                  admin: authState.data?._id,
                  image: encodedImage, // can be undefined
                  name: groupName
                };
            
                if (socket && socket.connected) {
                  socket.emit ("update-group", payload)
                }
            
                setSelectedUsers ([]);
                setImage();
                setEditName("");
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
            close ();
        }
    }

    const handleFileChange = (e) => {
        setImageUrl (URL.createObjectURL(e.target.files[0]));
        setImage (e.target.files[0]);
    };

    useEffect (() => {
        if (isOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
        else if (!isOpen && dialogRef.current?.open) {
            dialogRef.current.close();
        }
    }, [isOpen]);

    useEffect (() => {
        if (!liveGroup.messages) {
            setOpen (false); return null;
        }
        getDate ();
        getNonParticipants ();
    }, [liveGroup]);

    useEffect (() => {
        if (image) submitDetails ();
    }, [image])

    return (
        <>
            {isOpen && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>}
            <dialog ref={dialogRef} className="w-[30%] h-[80%] bg-[var(--background)] py-4 z-10">
                <button onClick={() => setOpen (!isOpen)} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[10]`}>✕</button>
                {!addParticipants ? <div className="flex flex-col gap-2">
                    <div className="relative w-20 h-20 mx-auto">
                        <img
                            src={imageUrl || defaultImage}
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
                            onChange={handleFileChange}
                            encType="multipart/form-data"
                        />
                    </div>

                    <div className="flex justify-center w-full mt-2">
                        {!editName && <div className="flex justify-center items-center gap-4 w-full">
                            <h2 className="text-lg">{liveGroup.name}</h2>
                            <i className="fa-solid fa-pencil text-[var(--heading)] text-sm hover:cursor-pointer" onClick={() => setEditName (true)}></i>
                        </div>}
                        {editName && <div className="flex items-center px-2 gap-2 w-[75%] border rounded-xl">
                            <input
                                name="name"
                                value={groupName}
                                onChange={(e) => setGroupName (e.target.value)}
                                className={`text-white py-[0.6rem] block w-full focus:outline-none bg-transparent`}
                                type="text"
                                autoComplete="false" autoCorrect="false" spellCheck="false"
                                placeholder="Group name"
                                required
                            />
                            {(groupName?.trim()?.length > 0 && groupName?.trim() !== liveGroup?.name) && <i className="fa-solid fa-check hover:text-green-400 hover:cursor-pointer" onClick={submitDetails}></i>}
                        </div>}
                    </div>

                    <h2 className="flex justify-center w-full text-sm font-extralight">
                        {liveGroup.members?.filter(member => member.isActive).length} members
                    </h2>

                    <h2 className="flex justify-center w-full text-sm font-extralight gap-2">
                        Created by <span className="font-semibold">{liveGroup.creator}</span> on <span className="font-semibold">{date}</span>
                    </h2>

                    <div className="w-full flex justify-between gap-4 px-4">
                        {liveGroup.members.find (member => member.userId === authState.data?._id).isActive && <button onClick={onLeaveGroup} className="w-full text-sm border border-[var(--input)] hover:bg-[var(--card)] text-[var(--text)] rounded-md py-2 font-bold">Leave group</button>}
                        <button onClick={() => {
                            setDelete (true); setOpen (false);}} className="w-full text-sm border border-red-400 hover:bg-[var(--card)] text-red-400 rounded-md py-2 font-bold">Delete group</button>
                    </div>

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
                        <div className="flex flex-col max-h-[20rem] overflow-y-auto">
                            {liveGroup.admins?.includes(authState.data._id) && <div 
                                className="flex items-center bg-transparent hover:shadow-md hover:cursor-pointer rounded-md hover:bg-[var(--topic)] p-2 px-4"
                                onClick={() => setAddParticipants (true)}
                            >
                                <i className="fa-solid fa-user-plus flex items-center justify-center rounded-full object-cover"></i>
                                <div className="ml-2 w-full">Add particpiants</div>
                            </div>}
                            {liveGroup.members?.some(m => m.isActive) ? (
                            liveGroup.members
                                .filter(member => member.isActive)
                                .map((user, index) => (
                                <User chat={user.userId} type="group-info" isAdmin={liveGroup.admins.includes(user.userId)} amAdmin={liveGroup.admins.includes(authState.data?._id)} key={index} />
                                ))
                            ) : (
                            <h2>No participants</h2>
                            )}
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

                    <div onClick={submitDetails} className="absolute bottom-4 w-full flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold text-[var(--buttonText)] bg-[var(--buttons)] p-2 rounded-md w-[60%] text-center">Add selected users</h2>
                    </div>
                </div>}
            </dialog>
        </>
    )
}

export default UpdateGroup;