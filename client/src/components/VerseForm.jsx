import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import "swiper/css";
import "swiper/css/navigation";
import {useDispatch, useSelector} from 'react-redux'
import toast from "react-hot-toast";
import { createVerse } from "../redux/Slices/verse.slice";

export default function VerseForm ({ open, setOpen, initialText }) {
    if (!open) return;
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [verseDetails, setVerseDetails] = useState ({
        text: initialText || "",
        interests: "",
        userId: authState.data?._id
    })

    function handleChange (e) {
      const {name, value} = e.target;
      setVerseDetails ({
        ...verseDetails,
        [name]: value
      })
    }

  const Createpost = async () => {
    const response = await dispatch (createVerse (verseDetails));
    
    if (!response) {
      toast.error("Something went wrong!");
    } else {
      setVerseDetails ({
        text: "",
        interests: ""
      })
      toast.success("Post created successfully!");
      setOpen(false);
    }
  };


  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity" />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl p-6">
            {/* Title */}
            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900 text-left">
              Create Verse
            </DialogTitle>

            {/* Caption Input */}
            <textarea
              className="mt-4 bg-gray-200 text-black w-full p-3 border rounded-lg resize-none focus:outline-none"
              rows="5"
              name="text"
              placeholder="Write a verse..."
              value={verseDetails.text}
              onChange={handleChange}
            ></textarea>

            {/* Post Button + interest */}
            <div className="flex justify-between items-center mt-4">
              {/* Hashtag Input */}
              <label className="flex items-center gap-2 px-3 h-12 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition w-[75%]">
                <i className="fa-solid fa-hashtag text-gray-800 text-lg"></i>
                <input 
                  type="text"
                  name="interests"
                  value={verseDetails.interests}
                  className="bg-transparent outline-none text-gray-700 w-full focus:outline-none"
                  placeholder="Add hashtags Ex: games, sports"
                  onChange={handleChange}
                />
              </label>

              {/* Post Button */}
              <button
                type="button"
                onClick={() =>{
                  setOpen(false);
                  Createpost();
                }}
                className="h-12 w-[20%] bg-gray-500 text-white font-semibold rounded-3xl hover:bg-gray-700 transition"
              >
                Post
              </button>
            </div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
