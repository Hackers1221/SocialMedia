import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import {useDispatch, useSelector} from 'react-redux'
import EmojiPicker from "emoji-picker-react";
import { createAnnouncement } from './../redux/Slices/announcement.slice'
import Suggestions from "./Suggestions";

export default function AnnouncementForm ({ open, setOpen }) {
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const emojiPickerRef = useRef (null);

    const [showPicker, setShowPicker] = useState(false);
    const [text, setText] = useState ();
    const [left, setLeft] = useState (150);
    const [username, setUsername] = useState ("");
    const [query, setQuery] = useState ("");
    const [showSuggestions, setShowSuggestions] = useState (false);


    const create = async () => {
        if (!text.toString()?.trim ()) return;
        const res = await dispatch (createAnnouncement ({
            text,
            user: authState.data?._id
        }))

        if (res.payload) {
            setText (""); setOpen (false);
        }
    };

    const handleTextChange = (e) => {
        let input = e.target.value.slice(0, 150); // Limit to 250 characters
        if (input.charAt(0) != '@') input = input.charAt(0).toUpperCase() + input.slice(1); // Capitalize first letter

        const match = input.match(/(^|\s)@(\w*)$/); // match text after the last "@"
        if (match) {
            if (match[2].trim().length >= 1) {
                setQuery (match[2]);
                setShowSuggestions(true);
            }
        } 
        else {
            setShowSuggestions(false);
        }

        setText(input);
        setLeft(150 - input.length);
    };

    const handleEmojiClick = (emojiData) => {
        setCaption ((prev) => prev + emojiData.emoji);
    };

    useEffect (() => {
        if (username) {
            setText (text.slice(0, text.lastIndexOf('@') + 1) + username);
            setUsername ("");
        }
    }, [username])

    useEffect (() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
            setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity" />
                {showPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-[19rem] left-[30rem] right-[50%] z-[99999]">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}

        <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-visible rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 w-[75%] md:w-[35%] p-6">
                {/* Title */}
                <DialogTitle as="h3" className="text-xl font-semibold text-gray-900 text-left">
                    Create Announcement
                </DialogTitle>

                {/* Caption Input */}
                <div className="relative w-full flex flex-col gap-4 rounded-lg bg-gray-200 mt-4 items-start p-4">
                    {/* <i
                        onClick={() => setShowPicker((prev) => !prev)}
                        className="mt-1 fa-regular fa-face-smile hover:cursor-pointer text-xl"
                    ></i> */}

                    {showSuggestions && (
                        <div className="absolute bottom-[10rem] left-0 z-[99999]">
                            <Suggestions query={query} setUsername={setUsername} showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions}/>
                        </div>
                    )}

                    <textarea
                        className="bg-transparent text-black w-full resize-none focus:outline-none"
                        rows="4"
                        placeholder="Start announcement..."
                        value={text}
                        name="text"
                        onChange={handleTextChange}
                    />
                    <h2 className="text-sm">Characters {left}/150</h2>
                </div>

                <h2 className="w-full text-left text-sm italic">*Your announcement will be removed after 24 hours</h2>


                {/* Post Button + interest */}
                <div className="flex justify-between items-center mt-4">

                    {/* Post Button */}
                    <button
                        type="button"
                        onClick={() => create()}
                        className={`h-12 w-[20%] bg-[var(--buttons)] text-[var(--buttonText)] font-semibold rounded-3xl hover:bg-[var(--buttonsHover)] hover:text-white transition border border-[var(--border)]`}
                    >
                        SEND
                    </button>
                </div>

            </DialogPanel>
            </div>
        </div>
        </Dialog>
    );
}
