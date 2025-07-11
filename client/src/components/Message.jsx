import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImagePreview from "./ImagePreview";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Message({ message }) {
    const authState = useSelector((state) => state.auth);

    const navigate = useNavigate ();
    const location = useLocation ();

    const [time, setTime] = useState();
    const [selectedImage, setSelectedImage] = useState ('');
    const [isOpen, setOpen] = useState (false);
    const [videoThumbnails, setVideoThumbnails] = useState({});

    const baseMessage = message.messageType;

    const [content, setContent] = useState ("");

    function getTime() {
        const date = new Date(message?.createdAt);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        setTime(`${hours}:${minutes}`);
    }

    function openImage (url) {
        if (message.targetType !== "message") {
            if (message.targetType === "post") navigate(`/${message.targetType}/${message.postId}`, { state: { backgroundLocation: location.pathname } });
            else navigate(`/${message.targetType}/${message.postId}`);
            return;
        }
        setSelectedImage (url);
        setOpen (true);
    }

    function onFileClick (url) {
        if (message.targetType !== "message") {
            navigate(`/${message.targetType}/${message.postId}`);
            return;
        }

        window.open(url, "_blank");
    }

    function getContent () {
        if (!message.content) return;

        const msg = message.content.split (" ");
        if (msg[1] === "added") {
            const firstPerson = (authState.data?.username !== msg[0] ? msg[0] : "You");
            const secondPerson = (authState.data?.username !== msg[2] ? msg[2] : "you");
            setContent (firstPerson + " added " + secondPerson);
        }
        else {
            const firstPerson = (authState.data?.username !== msg[0] ? msg[0] : "You");
            setContent (firstPerson + " " + msg.slice(1).join(" "));
        }
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
                    video.currentTime = Math.min(8, video.duration / 2);
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
        getContent ();
    }, [message._id]);

    return (
        <div className={`flex ${baseMessage ? `justify-center` : message.sender._id !== authState.data?._id ? `justify-start` : `justify-end`} items-start gap-4 mt-2 w-full`}>
            <ImagePreview isOpen={isOpen} setOpen={setOpen} url={selectedImage}/>
            {baseMessage && <div className="flex items-center px-2 py-1 w-max bg-[var(--card)] rounded-md">
                    <h2 className="text-xs font-extralight">{content}</h2>
                </div>}
           {!baseMessage && <div className={`flex items-end gap-2 w-[80%] ${message.sender._id !== authState.data?._id ? `justify-start` : `justify-end`}`}>
                {message.sender._id !== authState.data?._id && (
                    <div className="flex w-8 items-start">
                        <img className="h-8 w-8 rounded-full object-cover" src={message?.sender?.image?.url} />
                    </div>
                )}

                <div className={`${message.sender._id !== authState.data?._id ? `bg-[var(--card)]` : `bg-[#528fd9] text-white`} rounded-md inline-block p-2 ${message.targetType !== "message" ? "w-[50%] md:w-[40%]": "max-w-[80%]"}`}>
                    {message.targetType !== "message" && <div className="text-xs font-semibold italic">
                        View
                        {message.targetType === "pulse" ? " pulse" : " post"}
                    </div>}
                    <div className="flex flex-col">
                    {(message.groupId.length > 0 && message.sender?._id !== authState.data?._id) && <Link to={`/profile/${message.sender?.username}`} className="text-[10px] font-extralight hover:underline">{message.sender?.username}</Link>}
                        {/* File previews */}
                        {message.files?.length > 0 && (
                            <div className="flex flex-col gap-2 mt-1 mb-2">
                                {message.files.map((file, index) => {
                                    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "avif"];
                                    const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "odt", "ods", "odp", "csv", "tsv", "epub"];

                                    const extension = file.filename.split ('/').pop().toLowerCase ();

                                    const isImage = imageExtensions.includes (extension);
                                    const isDocument = documentExtensions.includes (extension);

                                    return isImage ? (
                                        <img
                                            key={index}
                                            src={file.url}
                                            alt={`The ${message.targetType} could not be loaded`}
                                            className="max-w-full max-h-48 rounded-md object-cover hover:cursor-pointer"
                                            onClick={() => openImage (file.url)}
                                        />
                                    ) : isDocument 
                                    ? (
                                        <div key={index} onClick={() => onFileClick (file.url)} className="flex gap-4 items-center bg-[var(--card)] p-2">
                                            <i className="fa-solid fa-file"></i>
                                            <h2 className="text-sm">{file.name.slice(0,30) + (file.name.length > 30 ? " ..." : "")}</h2>
                                        </div>
                                    ) 
                                    : (
                                        <div key={index} onClick={() => onFileClick (file.url)} className="relative">
                                            <i className="fa-solid fa-play absolute top-[50%] bottom-[50%] right-[50%] left-[50%]"></i>
                                            <img
                                                src={videoThumbnails[file.url]}
                                                alt={`The ${message.targetType} could not be loaded`}
                                                className="w-full max-h-96 rounded-md object-cover hover:cursor-pointer"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Text content */}
                        {message.content && (
                            <div className="flex items-end gap-4 w-full">
                                <p className="text-xs sm:text-sm break-words whitespace-pre-wrap overflow-wrap w-full">
                                    {message.content}
                                </p>
                                <p className="text-[0.5rem] sm:text-[0.6rem] font-extralight text-right mt-1">
                                    {time}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {message.sender._id === authState.data?._id && (
                    <div className="w-8">
                        <img className="w-8 h-8 rounded-full object-cover" src={authState.data?.image?.url} />
                    </div>
                )}
            </div>}
        </div>
    );
}

export default Message;
