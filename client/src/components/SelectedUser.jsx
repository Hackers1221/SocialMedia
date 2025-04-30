import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddUser from "./AddUser";

function SelectedUser ({ isOpen, setOpen, followers, post }) {
    const socket = useSelector ((state) => state.socket.socket);

    const dialogRef = useRef (null);

    const [selectedUsers, setSelectedUsers] = useState ([]);

    function sendPulse () {
        selectedUsers.map ((user) => {
            const payload = {
                sender: user.addedBy,
                recipient: user.id,
                content: post,
                isPost: true,
                files: []
            };

            if (socket && socket.connected) {
                socket.emit("sendMessage", payload);
            }
        })

        setOpen (!isOpen);
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
            {isOpen && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>}
            <dialog ref={dialogRef} className="w-[30%] h-[80%] bg-[var(--background)] py-4 z-10">
                <button onClick={() => setOpen (!isOpen)} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[10]`}>✕</button>
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
                    {followers?.length > 0 ? followers?.map ((user, key) => (
                        <AddUser userId={user._id} image={user.image} username={user.username} members={selectedUsers} setMembers={setSelectedUsers} key={key}/>
                    )) : <h2>No user to send</h2>}

                    <div onClick={sendPulse} className="absolute bottom-4 w-full flex justify-center items-center rounded-md py-2 hover:cursor-pointer">
                        <h2 className="text-black font-bold text-[var(--buttonText)] bg-[var(--buttons)] p-2 rounded-md w-[60%] text-center">Send</h2>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default SelectedUser;