import { Link, useNavigate } from "react-router-dom";
import ModeButton from "./ModeButton";
import { IoIosSettings } from "react-icons/io";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { disconnectSocket } from "../redux/Slices/socket.slice";
import { logout } from "../redux/Slices/auth.slice";
import { setTheme } from "../redux/Slices/theme.slice";

function MoreOptions ({ open, setOpen }) {
    if (!open) return null;

    const dispatch = useDispatch ();
    const navigate = useNavigate ();

    const dropUpRef = useRef (null);

    async function onLogout () {
        await dispatch (logout ());
        await dispatch (disconnectSocket ());
        navigate ("/login"); 
        dispatch (setTheme ("light"))
        return;
      }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropUpRef.current && !dropUpRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [open, setOpen]);

    return (
        <div ref={dropUpRef} className="fixed top-[68%] left-[2%] bg-[var(--topic)] z-[50] w-[20rem] rounded-xl py-4">
            <Link to="/settings" onClick={() => setOpen (!open)} className={`relative flex flex-row items-center h-11 hover:text-[var(--buttons)] pr-6 text-[var(--heading)]`}>
                <IoIosSettings className="ml-4" />
                <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
            </Link>
            <div className="flex justify-between items-center text-black gap-4 px-4 py-4">
                <h2 className="text-[var(--heading)]">Switch appearance</h2>
                <ModeButton />
            </div>
            <div className="flex justify-between items-center text-black gap-4 border-t border-gray-300 px-4 py-4 hover:cursor-pointer" onClick={onLogout}>
                <h2 className="text-[var(--heading)]">Logout</h2>
            </div>
        </div>
    )
}

export default MoreOptions;