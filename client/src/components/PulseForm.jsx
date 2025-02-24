import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createPulse } from "../redux/Slices/pulse.slice";
import toast from "react-hot-toast";

export default function PulseForm({ open, setOpen }) {
  const [video, setVideo] = useState([]);
  const [caption, setCaption] = useState("");
  const [interests, setInterests] = useState("");
  const authState = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();

  const Createpulse = async () => {
    const formData = new FormData();
    video.forEach((file) => formData.append("video", file));
    formData.append("caption", caption);
    formData.append("interests", interests);
    formData.append("userId", authState._id);

    const response = await dispatch(createPulse(formData));
    if (!response) {
      toast.error("Something went wrong!");
    } else {
      setVideo([]);
      setCaption("");
      setInterests("");
      toast.success("Post created successfully!");
      setOpen(false);
    }
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setVideo((prevVideos) => [...uploadedFiles, ...prevVideos]);
  };

  const handleDeleteFile = (index) => {
    setVideo((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity" />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl p-6">
            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900 text-left">
              Create Pulse
            </DialogTitle>

            {video.length > 0 ? (
              <div className="relative w-full">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                  modules={[Navigation]}
                  className="mt-4 w-full h-64 md:h-80"
                >
                  {video.map((file, index) => (
                    <SwiperSlide key={index} className="relative flex items-center justify-center rounded-lg overflow-hidden">
                      <video controls className="w-full h-full object-cover">
                        <source src={URL.createObjectURL(file)} type={file.type} />
                      </video>
                      <button
                        className="absolute top-3 right-3 bg-gray-700 w-10 h-10 text-white rounded-[50%] shadow-md hover:bg-gray-500"
                        onClick={() => handleDeleteFile(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </SwiperSlide>
                  ))}
                  <div className="swiper-button-prev !text-white !w-8 !h-8 flex items-center justify-center shadow-lg"></div>
                  <div className="swiper-button-next !text-white !w-8 !h-8 flex items-center justify-center shadow-lg"></div>
                </Swiper>
              </div>
            ) : (
              <div className="mt-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <i className="fa-solid fa-video text-gray-500 text-3xl"></i>
                  <span className="mt-2 text-sm text-gray-600">Add video</span>
                  <input type="file" className="hidden" accept="video/*" encType="multipart/form-data" onChange={handleFileChange} multiple />
                </label>
              </div>
            )}

            <textarea
              className="mt-4 bg-gray-200 text-black w-full p-3 border rounded-lg focus:ring focus:ring-gray-300 resize-none"
              rows="2"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>

            <div className="flex justify-between items-center mt-4">
              <label className="flex items-center gap-2 px-3 h-12 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition w-[75%]">
                <i className="fa-solid fa-hashtag text-gray-800 text-lg"></i>
                <input 
                  type="text"
                  value={interests}
                  className="bg-transparent outline-none text-gray-700 w-full"
                  placeholder="Add hashtags Ex: games, sports"
                  onChange={(e) => setInterests(e.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  Createpulse();
                }}
                className="h-12 w-[20%] bg-red-500 text-white font-semibold rounded-3xl hover:bg-gray-800 transition"
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
