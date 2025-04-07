import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import User from '../../components/User'
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecentMessages } from "../../redux/Slices/chat.slice";

const Messenger = () => {
  const authState = useSelector ((state) => state.auth);
  const chatState = useSelector ((state) => state.chat);

  const dispatch = useDispatch ();

  const socket = useSelector((state) => state.socket.socket);

  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState ('recent');
  const [files, setFiles] = useState([]);


  const sendMessage = () => {
    if (message?.trim() || files?.length) {  
      const readerPromises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
            reader.onerror = reject;
            reader.readAsDataURL(file); // base64 encode
          })
      );
  
      Promise.all(readerPromises).then((encodedFiles) => {
        const payload = {
          sender: authState.data?._id,
          recipient: chatState.recipient?._id,
          content: message.trim(),
          files: encodedFiles, // array of base64 files
        };
  
        if (socket && socket.connected) {
          socket.emit("sendMessage", payload);
        }
        
        setMessage("");
        setFiles([]);
      });
    }
  };
    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    };

    async function getRecent () {
      await dispatch (getRecentMessages (authState.data?._id));
    }

    function removeFile (index) {
      setFiles((prev) => prev.filter((_, idx) => idx !== index));
    } 

    useEffect (() => {
      getRecent ();
    }, [chatState.messages])
    

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [chatState.messages]);

  return (
    <div className={`fixed top-[4rem] md:top-0 md:left-[18rem] left-[1rem] w-[85%] h-[82vh] md:h-[100vh] flex flex-col flex-grow overflow-y-auto`}>
      {/* Left Sidebar */}
        <div className="flex flex-row h-full w-full overflow-x-hidden ">
          <div className="flex flex-col pt-4 px-4 w-[18rem] text-[var(--heading)] bg-[var(--card)] flex-shrink-0">
            <div className="w-full flex justify-between items-center">
                <h2 className={`heading text-[2rem] text-[var(--heading)]`}>Chat</h2>
                <i className="fa-solid fa-pen-to-square hover:cursor-pointer"></i>
                {/* <ChatDropdown
                  selected={selected}
                  setSelected={setSelected}
                /> */}
            </div>
            <div className={`flex items-center rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                <input
                    type="text"
                    placeholder="Search people, groups and messages"
                    className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                    // onChange={onChangeHandler}
                    name = "query"
                    // value = {query}
                />
                <button className={`text-[var(--text)] text-2xl h-full`}>
                    <X />
                </button>
            </div>
            <div className={`flex justify-start gap-4 bg-[var(--card)] border-b border-[var(--border)]`}>
                    <button
                      className={`py-2 font-semibold flex items-center space-x-2 text-sm ${
                        activeTab === "recent" ? `text-[var(--text)]` : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab("recent")}
                    >
                      <span>Recent</span>
                    </button>
                    <button
                      className={`py-2 font-semibold flex items-center space-x-2 text-sm ${
                        activeTab === "followers" ? `text-[var(--text)]` : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab("followers")}
                    >
                      <span>Followers</span>
                    </button>
            </div>
            <div className="flex flex-col">
              {activeTab === 'recent' && <div className="flex flex-col space-y-1 mt-4 h-full overflow-y-auto">
                {chatState.recentMessages?.length > 0 && chatState.recentMessages?.map ((chat, index) => (
                  <User chat={chat} key={index}/>
                ))}
              </div>}
              {activeTab === 'followers' && <div className="flex flex-col space-y-1 mt-4 h-full overflow-y-auto">
                {authState.data?.follower?.length > 0 && authState.data?.follower?.map ((user, index) => (
                  <User chat={user} type={'follower'} key={index}/>
                ))}
              </div>}
            </div>
          </div>
          <div className="flex flex-col w-[73%] h-full border-l border-[var(--border)]">
            {chatState.recipient?.name?.length > 0 ? <div className="relative flex flex-col text-[var(--heading)] bg-[var(--card)] h-full">
              <div className="flex gap-4 justify-between items-center w-full bg-[var(--topic)] p-2">
                <div className="flex items-center gap-2">
                  <Avatar url={chatState.recipient?.image?.url} size={'md'}/>
                  <div className="flex flex-col">
                    <Link to={`/profile/${chatState.recipient?.username}`} className="hover:underline">{chatState.recipient?.name}</Link>
                    {chatState.onlineUsers?.includes(chatState.recipient?._id) && 
                        <div className="flex gap-2 items-center">
                          <div className="w-[0.4rem] h-[0.4rem] bg-green-400 rounded-full inline-block"></div>
                          <h2 className="text-[0.7rem] font-extralight">Active Now</h2>
                        </div>}
                  </div>
                </div>
                <div className="flex items-center gap-8 mr-4">
                  <i className="fa-solid fa-phone text-[var(--buttons)] hover:cursor-pointer"></i>
                  <i className="fa-solid fa-video text-[var(--buttons)] hover:cursor-pointer"></i>
                  <i className="fa-solid fa-ellipsis-vertical text-[var(--buttons)] hover:cursor-pointer"></i>
                </div>
              </div>
              <div className="p-4 h-full overflow-y-auto w-full mb-16" ref={chatContainerRef}>
                {chatState.messages?.length > 0 && chatState?.messages.map ((message, key) => (
                  <Message message={message} key={key}/>
                ))}
              </div>
              <div className="absolute bottom-0 pb-4 flex flex-row items-center h-16 bg-[var(--card)] w-full px-4">
                <div className="mt-auto flex flex-col items-center gap-3 p-2 relative w-full">
                  <div className="flex items-center w-full p-2 px-4 rounded-full border border-[var(--input)] relative">
                    {/* File Upload Button */}
                    <label htmlFor="file-upload" className="cursor-pointer text-[var(--text)]">
                      <i className="fa-solid fa-paperclip text-sm"></i>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      encType= "multipart/form-data"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {files?.length > 0 && <div className="ml-3 flex gap-2">
                        {files?.map ((file, index) => (
                          <div className="flex gap-2 bg-[var(--topic)] px-2" key={index}>
                            {file?.name}
                            <h2 className="hover:cursor-pointer" onClick={() => removeFile (index)}>✕</h2>
                          </div>
                        ))}
                      </div>}
                    {/* Message Input */}
                    <input
                      type="text"
                      value={message}
                      className="flex-1 bg-transparent text-[var(--text)] font-normal outline-none ml-4"
                      placeholder="Write a message..."
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                    />
                    {/* Send Button */}
                    <FaPaperPlane
                      onClick={sendMessage}
                      id="send"
                      className="text-[var(--text)] cursor-pointer ml-3"
                    />
                  </div>
              </div>
              </div>
            </div> : 
            <div className="relative flex flex-col justify-center items-center flex-shrink-0 text-[var(--heading)] bg-[var(--card)] h-full">
              <h2>Select a user to start messaging</h2>
            </div>}
          </div>
        </div>
      </div>
  );
};

export default Messenger;
