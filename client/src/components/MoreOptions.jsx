import { Link } from "react-router-dom";
import ModeButton from "./ModeButton";
import { IoIosSettings } from "react-icons/io";
import { useEffect, useRef } from "react";

function MoreOptions ({ open, setOpen }) {
    if (!open) return null;

    const dropUpRef = useRef (null);

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
        <div ref={dropUpRef} className="fixed top-[75%] left-[1%] bg-[var(--topic)] z-[50] w-[20rem] rounded-md p-4">
            <div className="flex justify-between items-center font-semibold text-black gap-4 p-4">
                <h2 className="text-[var(--text)]">Switch Mode</h2>
                <ModeButton />
            </div>
            <Link to="/settings" onClick={() => setOpen (!open)} className={`relative flex flex-row items-center h-11 hover:text-[var(--buttons)] hover:shadow-md font-semibold pr-6 text-[var(--text)]`}>
                <IoIosSettings className="ml-4" />
                <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
            </Link>
        </div>
    )
}

export default MoreOptions;