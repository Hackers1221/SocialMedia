import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ImagePreview from "./ImagePreview";

function Message({ message }) {
    const authState = useSelector((state) => state.auth);
    const chatState = useSelector ((state) => state.chat);

    const [time, setTime] = useState();
    const [selectedImage, setSelectedImage] = useState ('');
    const [isOpen, setOpen] = useState (false);
    const [videoThumbnails, setVideoThumbnails] = useState({});


    function getTime() {
        const date = new Date(message?.timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        setTime(`${hours}:${minutes}`);
    }

    function openImage (url) {
        setSelectedImage (url);
        setOpen (true);
    }

    useEffect(() => {
        message.files?.forEach((file) => {
            const extension = file.filename.split('/').pop().toLowerCase();
            const videoExtensions = ["mp4", "mkv", "webm", "mov", "avi", "flv", "wmv", "mpeg", "mpg", "3gp"];
            const isVideo = videoExtensions.includes(extension);
    
            if (isVideo && !videoThumbnails[file.url]) {
                const video = document.createElement("video");
                video.src = file.url;
                video.crossOrigin = "anonymous";
                video.preload = "metadata";
                video.muted = true;
    
                video.addEventListener("loadedmetadata", () => {
                    video.currentTime = Math.min(5, video.duration / 2);
                });
    
                video.addEventListener("seeked", () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                    const thumbnail = canvas.toDataURL("image/png");
                    setVideoThumbnails((prev) => ({
                        ...prev,
                        [file.url]: thumbnail
                    }));
                });
    
                video.load();
            }
        });
    }, [message?.files]);    

    useEffect(() => {
        getTime();
    }, []);

    const isOwnMessage = message.sender._id == authState.data?._id;

    return (
        <div className={`flex ${!isOwnMessage ? `justify-start` : `justify-end`} items-start gap-4 mt-2 w-full`}>
            <ImagePreview isOpen={isOpen} setOpen={setOpen} url={selectedImage}/>
            {!isOwnMessage && (
                <div className="flex w-8 items-start">
                    <img className="h-8 w-8 rounded-full object-cover" src={message?.sender?.image?.url} />
                </div>
            )}

            <div className={`${!isOwnMessage ? `bg-[var(--background)]` : `bg-[var(--topic)]`} p-2 rounded-md inline-block max-w-[65%] w-fit`}>
                <div className="flex flex-col gap-2">
                    {/* File previews */}
                    {message.files?.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1">
                            {message.files.map((file, index) => {
                                const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
                                const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "odt", "ods", "odp", "csv", "tsv", "epub"];

                                const extension = file.filename.split ('/').pop().toLowerCase ();

                                const isImage = imageExtensions.includes (extension);
                                const isDocument = documentExtensions.includes (extension);

                                return isImage ? (
                                    <img
                                        key={index}
                                        src={file.url}
                                        alt={file.filename}
                                        className="max-w-full max-h-48 rounded-md object-cover hover:cursor-pointer"
                                        onClick={() => openImage (file.url)}
                                    />
                                ) : isDocument 
                                ? (
                                    <a key={index} href={file.url} target='_blank' className="flex gap-4 items-center bg-[var(--card)] p-2">
                                        <i className="fa-solid fa-file"></i>
                                        <h2 className="text-sm">{file.name.slice(0,30) + (file.name.length > 30 ? " ..." : "")}</h2>
                                    </a>
                                ) 
                                : (
                                    <a key={index} href={file.url} target="_blank" className="relative">
                                        <i className="fa-solid fa-play absolute top-[50%] bottom-[50%] right-[50%] left-[50%]"></i>
                                        <img
                                            src={videoThumbnails[file.url]}
                                            alt={file.name}
                                            className="max-w-full max-h-48 rounded-md object-cover hover:cursor-pointer"
                                        />
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Text content */}
                    {message.content && (
                        <div className="flex items-end gap-4 w-full">
                            <p className="text-sm break-words whitespace-pre-wrap overflow-wrap w-[90%]">
                                {message.content}
                            </p>
                            <p className="text-[0.6rem] font-extralight text-right mt-1">
                                {time}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isOwnMessage && (
                <div className="w-8">
                    <img className="w-8 h-8 rounded-full object-cover" src={authState.data?.image?.url} />
                </div>
            )}
        </div>
    );
}

export default Message;
