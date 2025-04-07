import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import AddUser from "./AddUser";
import toast from "react-hot-toast";
import User from '../components/User'
import { createGroup } from "../redux/Slices/group.slice";
import { FaSpinner } from "react-icons/fa";

function CreateGroup ({ isOpen, setOpen }) {
    if (!isOpen) return null;

    const authState = useSelector ((state) => state.auth);

    const dialogRef = useRef (null);
    const dispatch = useDispatch ();

    const [members, setMembers] = useState ([authState.data?._id]);
    const [groupEdit, setGroupEdit] = useState (false);
    const [groupName, setGroupName] = useState ("");
    const [loading, setLoading] = useState(false);


    const defaultImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    function close () {
        setMembers([]);
        setOpen (!isOpen);
    }

    function goNext () {
        if (members.length <= 2) {
            toast.error ('Select atleast 2 members'); return;
        }

        setGroupEdit (true);
    }

    async function submit () {
        try {
            setLoading (true);

            await dispatch (createGroup ({
                name: groupName,
                members,
                image: defaultImage,
                admins: [authState.data?._id]
            }))
        } catch (error) {
            toast.error ('Something went wrong');
        } finally {
            setOpen (false);
            setLoading (false);
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

    return (
        <>
            {isOpen && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[20]"></div>}
            <dialog ref={dialogRef} className="w-[30%] h-[80%] bg-[var(--background)]">
                <button onClick={close} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[500]`}>✕</button>
                {!groupEdit && <div className="relative flex justify-center h-full w-full">
                    <div className="p-4 w-full">
                        <div className={`flex items-center rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                            <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                            <input
                                type="text"
                                placeholder="Search people, groups and messages"
                                className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                                // onChange={onChangeHandler}
                                name = "query"
                                // value = {query}
                            />
                            <button className={`text-[var(--text)] text-2xl h-full`}>
                                <X />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {authState.data?.follower?.map ((user, key) => (
                                <AddUser userId={user} members={members} setMembers={setMembers} key={key}/>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-4 bg-[var(--buttons)] w-[80%] flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold" onClick={goNext}>Next</h2>
                    </div>
                </div>}
                {groupEdit && <div className="relative h-full w-full p-4">
                    <div className="flex flex-col items-center gap-6">
                        <img
                        src={defaultImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border"
                        />
                        <div className="flex justify-center items-center w-full">
                            <input
                                type="file"
                                accept="image/*"
                                className={`px-4 py-2 border-[var(--border)] rounded-md text-sm text-[var(--text)] font-medium`}
                                // onChange={handleImageChange}
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
                            <User chat={user} type={'follower'} key={index}/>
                        ))}
                    </div>
                    <div className="absolute bottom-4 bg-[var(--buttons)] w-[90%] flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold" onClick={submit}>{loading ? (
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