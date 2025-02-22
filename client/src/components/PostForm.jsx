import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function PostForm({ open, setOpen }) {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [caption, setCaption] = useState("");

  const handleFileChange = (event, type) => {
    const uploadedFiles = Array.from(event.target.files);
    console.log(uploadedFiles);
    if (type === "image") {
      setImages((prevImages) => [...uploadedFiles, ...prevImages]);
    } else {
      setVideos((prevVideos) => [...uploadedFiles, ...prevVideos]);
    }
  };

  const handleDeleteFile = (index, type) => {
    if (type === "image") {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
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
              Create Post
            </DialogTitle>

            {/* File Upload Section */}
            {images.length > 0 || videos.length > 0 ? (
              <div className="relative w-full">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                  modules={[Navigation]}
                  className="mt-4 w-full h-64 md:h-80"
                >
                  {[...images, ...videos].map((file, index) => (
                    <SwiperSlide key={index} className="relative flex items-center justify-center rounded-lg overflow-hidden">
                      {file.type.startsWith("image") ? (
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full object-cover" />
                      ) : (
                        <video controls className="w-full h-full object-cover">
                          <source src={URL.createObjectURL(file)} type={file.type} />
                        </video>
                      )}
                      <button
                        className="absolute top-3 right-3 bg-gray-400 w-10 h-10 text-white  rounded-[50%] shadow-md hover:bg-gray-500"
                        onClick={() => handleDeleteFile(index, file.type.startsWith("image") ? "image" : "video")}
                      >
                        <i className ="fa-solid fa-trash"></i>
                      </button>
                    </SwiperSlide>
                  ))}
                  <div className="swiper-button-prev !text-white !w-8 !h-8 flex items-center justify-center shadow-lg"></div>
                  <div className="swiper-button-next !text-white !w-8 !h-8 flex items-center justify-center shadow-lg"></div>
                </Swiper>
              </div>
            ) : (
              <div className="mt-6 flex gap-4">
                <label className="flex flex-col items-center justify-center w-1/2 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <i className="fa-solid fa-image text-gray-500 text-3xl"></i>
                  <span className="mt-2 text-sm text-gray-600">Add an Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} multiple />
                </label>
                <label className="flex flex-col items-center justify-center w-1/2 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <i className="fa-solid fa-video text-gray-500 text-3xl"></i>
                  <span className="mt-2 text-sm text-gray-600">Add a Video</span>
                  <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, "video")} multiple />
                </label>
              </div>
            )}

            {/* Separate Add Buttons */}
            {(images.length > 0 || videos.length > 0) && (
              <div className="absolute top-4 right-7 flex gap-2">
                <label className="bg-gray-400 text-white px-3 py-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-700 transition flex items-center gap-2">
                  <i className="fa-solid fa-image text-lg"></i>
                  <span className="text-sm font-medium">Add Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} multiple />
                </label>
                <label className="bg-gray-400 text-white px-3 py-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-700 transition flex items-center gap-2">
                  <i className="fa-solid fa-video text-lg"></i>
                  <span className="text-sm font-medium">Add Video</span>
                  <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, "video")} multiple />
                </label>
              </div>
            )}

            {/* Caption Input */}
            <textarea
              className="mt-4 bg-gray-200 text-black w-full p-3 border rounded-lg focus:ring focus:ring-gray-300 resize-none"
              rows="2"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>

            {/* Post Button + interest */}
            <div className="flex justify-between items-center mt-4">
              {/* Hashtag Input */}
              <label className="flex items-center gap-2 px-3 h-12 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition w-[75%]">
                <i className="fa-solid fa-hashtag text-gray-800 text-lg"></i>
                <input 
                  type="text"
                  className="bg-transparent outline-none text-gray-700 w-full"
                  placeholder="Add hashtags Ex: games, sports"
                />
              </label>

              {/* Post Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
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
