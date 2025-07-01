import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { createPulse } from "../redux/Slices/pulse.slice";
import { showToast } from "../redux/Slices/toast.slice";
import Suggestions from "./Suggestions";

export default function PulseForm({ open, setOpen }) {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [interests, setInterests] = useState("");
  const [showSuggestions, setShowSuggestions] = useState (false);
    const [username, setUsername] = useState ("");
    const [query, setQuery] = useState ("");

  const authState = useSelector((state) => state.auth.data);

  const dispatch = useDispatch();

  const Createpulse = async () => {
    if(!video) {
      return dispatch (showToast ({ message: "Pulse can't be empty", type: 'error' }));
    }

    if (video.size > 10 * 1024 * 1024) {
        return dispatch (showToast ({ message: "Video size is greater than 10 MB", type: 'error' }));
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("video", video);
    formData.append("interests", interests);
    formData.append("user", authState._id);

    const response = await dispatch(createPulse(formData));
    if (!response.payload) {
      dispatch (showToast ({ message: 'Something went wrong!', type: 'error' }));
    } else {
      setVideo(null);
      setCaption("");
      setInterests("");

      dispatch (showToast ({ message: 'Pulse created successfully!', type: 'success' }));
      setOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission or default behavior

        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        const updatedCaption =
            caption.slice(0, start) + '\n' + caption.slice(end);

        setCaption (updatedCaption);

        // Move the cursor to the correct position after inserting `\n`
        setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = start + 1;
        }, 0);
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    if (name === 'caption') {
        const match = value.match(/(^|\s)@(\w*)$/); // match text after the last "@"
        if (match) {
            if (match[2].trim().length >= 1) {
                setQuery (match[2]);
                setShowSuggestions(true);
            }
        } 
        else {
            setShowSuggestions(false);
        }

        setCaption (value);      
    }
    else setInterests (value);
  }

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setVideo(uploadedFile);
  };

  const handleDeleteFile = () => {
    setVideo(null);
  };


  useEffect (() => {
        if (username) {
            setCaption (caption.slice(0, caption.lastIndexOf('@') + 1) + username);
            setUsername ("");
        }
    }, [username])

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[999]">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 z-[998] transition-opacity" />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-visible rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl p-6">
            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900 text-left">
              Create Pulse
            </DialogTitle>

            {video ? (
              <div className="relative w-full mt-4">
                <video controls className="w-full h-64 md:h-80 object-cover rounded-lg">
                  <source src={URL.createObjectURL(video)} type={video.type} />
                </video>
                <button
                  className="absolute top-3 right-3 bg-gray-700 w-10 h-10 text-white rounded-full shadow-md hover:bg-gray-500"
                  onClick={handleDeleteFile}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <i className="fa-solid fa-video text-gray-500 text-3xl"></i>
                  <span className="mt-2 text-sm text-gray-600">Add video</span>
                  <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                </label>
              </div>
            )}

            {showSuggestions && (
                <div className="absolute bottom-[11rem] left-5 z-[99999]">
                    <Suggestions query={query} setUsername={setUsername} showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions}/>
                </div>
            )}

            <textarea
              className="mt-4 bg-gray-200 text-black w-full p-3 border rounded-lg focus:ring focus:ring-gray-300 resize-none"
              rows="2"
              placeholder="Write a caption..."
              name="caption"
              value={caption}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            ></textarea>

            <div className="flex justify-between items-center mt-4">
            <label className="flex items-center gap-2 px-3 h-12 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition w-[75%]">
                <i className="fa-solid fa-hashtag text-gray-800 text-lg"></i>
                <input 
                  type="text"
                  name="interests"
                  value={interests}
                  className="bg-transparent outline-none text-gray-700 w-full focus:outline-none"
                  placeholder="Add hashtags Ex: games, sports"
                  onChange={handleChange}
                />
              </label>
              <button
                type="button"
                onClick={Createpulse}
                className={`h-12 w-[20%] bg-[var(--buttons)] text-[var(--buttonText)] font-semibold rounded-3xl hover:bg-[var(--buttonsHover)] hover:text-white transition border border-[var(--border)]`}
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
