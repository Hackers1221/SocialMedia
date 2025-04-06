// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// function Message ({ message }) {
//     const authState = useSelector ((state) => state.auth);
//     const chatState = useSelector ((state) => state.chat);

//     const [time, setTime] = useState ();

//     function getTime () {
//         const date = new Date(message?.timestamp);
//         const hours = date.getHours().toString().padStart(2, "0");
//         const minutes = date.getMinutes().toString().padStart(2, "0");

//         setTime(`${hours}:${minutes}`);
//     }

//     useEffect (() => {
//         getTime ();
//     }, [message._id])

//     return (
//         <div className={`flex ${message.sender !== authState.data?._id ? `justify-start` : `justify-end`} items-start gap-4 mt-2 w-full`}>
//             {message.sender !== authState.data?._id &&
//                 <div className="flex w-8 items-start">
//                     <img className="h-8 w-8 rounded-full" src={chatState.recipient?.image?.url} />
//                 </div>}
//                 <div className={`${message.sender !== authState.data?._id ? `bg-[var(--background)]` : `bg-[var(--topic)]`} p-2 rounded-md inline-block max-w-[65%] w-fit`}>
//                     <div className="flex items-end gap-4 w-full">
//                         <p className="text-sm break-words whitespace-pre-wrap overflow-wrap w-[90%]">
//                            {message.content}
//                         </p>
//                         <p className="text-[0.6rem] font-extralight text-right mt-1">
//                            {time}
//                         </p>
//                     </div>
//                 </div>

//             {message.sender === authState.data?._id &&
//                 <div className="w-8">
//                     <img  className="rounded-full" src={authState.data?.image?.url} />
//                 </div>}
//         </div>
//     )
// }

// export default Message;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Message({ message }) {
    const authState = useSelector((state) => state.auth);
    const [time, setTime] = useState();

    function getTime() {
        const date = new Date(message?.timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        setTime(`${hours}:${minutes}`);
    }

    useEffect(() => {
        getTime();
    }, []);

    const isOwnMessage = message.sender._id == authState.data?._id;

    return (
        <div className={`flex ${!isOwnMessage ? `justify-start` : `justify-end`} items-start gap-4 mt-2 w-full`}>
            {!isOwnMessage && (
                <div className="flex w-8 items-start">
                    <img className="h-8 w-8 rounded-full" src={message?.recipient?.image?.url} />
                </div>
            )}

            <div className={`${!isOwnMessage ? `bg-[var(--background)]` : `bg-[var(--topic)]`} p-2 rounded-md inline-block max-w-[65%] w-fit`}>
                <div className="flex flex-col gap-2">
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

                    {/* File previews */}
                    {message.files?.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1">
                            {message.files.map((file, index) => {
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.filename);
                                return isImage ? (
                                    <img
                                        key={index}
                                        src={file.url}
                                        alt={file.filename}
                                        className="max-w-full max-h-48 rounded-md object-contain border"
                                    />
                                ) : (
                                    <a
                                        key={index}
                                        href={file.url}
                                        download
                                        className="text-xs text-blue-600 underline break-all"
                                    >
                                        {file.filename}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {isOwnMessage && (
                <div className="w-8">
                    <img className="rounded-full" src={message?.sender?.image?.url} />
                </div>
            )}
        </div>
    );
}

export default Message;
