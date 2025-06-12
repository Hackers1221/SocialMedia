import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import User from '../../components/User'
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecentMessages } from "../../redux/Slices/chat.slice";
import CreateGroup from "../../components/CreateGroup";
import { getRecentMessage } from "../../redux/Slices/group.slice";
import { MdOutlineGroupAdd } from "react-icons/md";
import UpdateGroup from "../../components/UpdateGroup";
import ImagePreview from "../../components/ImagePreview";
import EmojiPicker from "emoji-picker-react";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import { getFollowerDetails } from "../../redux/Slices/auth.slice";


const Messenger = () => {
  const authState = useSelector ((state) => state.auth);
  const chatState = useSelector ((state) => state.chat);
  const groupState = useSelector ((state) => state.group);

  const emojiPickerRef = useRef (null);

  const dispatch = useDispatch ();

  const socket = useSelector((state) => state.socket.socket);

  const [message, setMessage] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState ('recent');
  const [files, setFiles] = useState([]);
  const [groupFiles, setGroupFiles] = useState([]);
  const [groupCreate, setGroupCreate] = useState (false);
  const [groupUpdate, setGroupUpdate] = useState (false);
  const [recent, setRecent] = useState ([]);
  const [group,setGroup] = useState();
  const [isOpen, setOpen] = useState (false);
  const [selectedImage, setSelectedImage] = useState ("");
  const [query,setQuery] = useState("");
  const [isSelected, setSelected] = useState (false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showPicker, setShowPicker] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState (false);
  const [followers,setFollowers] = useState();


  const defaultImage = "https://t3.ftcdn.net/jpg/12/81/12/20/240_F_1281122039_wYCRIlTBPzTUzyh8KrPd87umoo52njyw.jpg";


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

  const sendGroupMessage = () => {
    if (groupMessage?.trim() || groupFiles?.length) {  

      const readerPromises = groupFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
            reader.onerror = reject;
            reader.readAsDataURL(file); 
          })
      );
  
      Promise.all(readerPromises).then((encodedFiles) => {
        const payload = {
          groupId: groupState.liveGroup?._id,
          sender: authState.data?._id,
          recipient: groupState.liveGroup?.members,
          content: groupMessage.trim(),
          files: encodedFiles, // array of base64 files
        };
  
        if (socket && socket.connected) {
          socket.emit("sendGroupMessage", payload);
        }
        
        setGroupMessage("");
        setGroupFiles([]);
      });
    }
  };

    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    };

    const handleGroupFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setGroupFiles(selectedFiles);
    };

    async function getRecent () {
      const res = await dispatch (getRecentMessages (authState.data?._id));
      setRecent (res.payload?.data.messages);
    }

    function removeFile (index) {
      setFiles((prev) => prev.filter((_, idx) => idx !== index));
    } 

    async function onGroupClick() {
      const response = await dispatch(getRecentMessage(authState.data?._id));
      if (response.payload) {
        setActiveTab('groups');
        setGroup(groupState.groupDetails);
      }
    }

    const handleEmojiClick = (emojiData) => {
      if (activeTab !== 'groups') setMessage ((prev) => prev + emojiData.emoji);
      else setGroupMessage ((prev) => prev + emojiData.emoji);
    };

    const onSearchHandler = (e) => {
        setQuery(e.target.value);
    }

    const getDetails = async() => {
        const response = await dispatch(getFollowerDetails(authState.data._id));
        setFollowers(response.payload?.data?.userdata);
    }

    useEffect (() => {
      setGroup (groupState.groupDetails);
    }, [groupState.groupDetails])


    useEffect(() => {
      setGroup(groupState?.groupDetails);
      if(activeTab==="followers") getDetails();
    },[activeTab]);
  
    useEffect (() => { 
      getRecent ();
    }, [chatState.messages]);

    useEffect(() => {        
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  
    useEffect(() => {
      if (chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }, 100); // give time for messages to render
      }
    }, [chatState.messages, groupState.liveGroup?.messages]);

    useEffect(() => {
      const q = query.trim().toLowerCase();
    
      if(activeTab=="recent"){
        if (q === "") {
          setRecent(chatState.recentMessages);
        } else {
          const filteredMessages = chatState.recentMessages.filter((msg) =>
            msg.user?.username?.toLowerCase().includes(q)
          );
          setRecent(filteredMessages);
        }
      }else if(activeTab=="groups"){
        if (q === "") {
          setGroup(groupState.groupDetails);
        } else {
          const filteredGroup = groupState.groupDetails.filter((group) =>
            group.group?.name?.toLowerCase().includes(q)
          );
          setGroup(filteredGroup);
        }
      }
    }, [query]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
          setShowPicker(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div className={`fixed top-[4rem] md:top-0 md:left-[18rem] left-[1rem] w-[92%] h-[90vh] md:h-[100vh] flex flex-col flex-grow overflow-y-auto`}>
      {/* Left Sidebar */}
        <CreateGroup isOpen={groupCreate} setOpen={setGroupCreate}/>
        <UpdateGroup isOpen={groupUpdate} setOpen={setGroupUpdate} isDelete={isDialogOpen} setDelete={setDialogOpen}/>
        <ImagePreview isOpen={isOpen} setOpen={setOpen} url={selectedImage}/>

        <ConfirmDeleteDialog
            open={isDialogOpen}
            setOpen={setDialogOpen}
            type={"groupDelete"}
        />

        <div className="flex flex-row h-full w-full overflow-x-hidden ">
          {(screenWidth < 768 ? !isSelected : true) && <div className={`flex flex-col pt-4 px-4 ${screenWidth < 768 ? `w-full` : `w-[18rem]`} text-[var(--heading)] bg-[var(--card)] flex-shrink-0`}>
            <div className="w-full flex justify-between items-center">
                <h2 className={`heading text-[2rem] text-[var(--heading)]`}>Chat</h2>
                <div className="w-8 h-8 hover:bg-black/10 rounded-md flex items-center justify-center">
                  <MdOutlineGroupAdd className="hover:cursor-pointer text-2xl" title="Create group" onClick={() => setGroupCreate(true)}/>
                </div>
            </div>
            <div className={`flex items-center rounded-md px-2 my-4 shadow-md border border-[var(--input)]`}>
                <i className="fa-solid fa-magnifying-glass text-[var(--heading)]"></i>
                <input
                    type="text"
                    placeholder="Search people, groups and messages"
                    className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none text-sm`}
                    onChange={onSearchHandler}
                    name = "query"
                    value = {query}
                />
                {query.length > 0 && <button className={`text-[var(--text)] text-2xl h-full`} onClick={() => setQuery ("")}>
                    <X />
                </button>}
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
                        activeTab === "groups" ? `text-[var(--text)]` : "text-gray-400"
                      }`}
                      onClick={onGroupClick}
                    >
                      <span>Groups</span>
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
                {recent?.length > 0 && recent?.map ((chat, index) => (
                  <User chat={chat} key={index} setSelected={setSelected}/>
                ))}
              </div>}
              {activeTab === 'groups' && <div className="flex flex-col space-y-1 mt-4 h-full overflow-y-auto">
                {group?.map ((chat, index) => (
                  <User chat={chat} type={'groups'} key={index} setSelected={setSelected}/>
                ))}
              </div>}
              {activeTab === 'followers' && <div className="flex flex-col space-y-1 mt-4 h-full overflow-y-auto">
                {authState.data?.follower?.length > 0 && authState.data?.follower?.map ((user, index) => (
                  <User chat={user} type={'follower'} key={index} setSelected={setSelected}/>
                ))}
              </div>}
            </div>
          </div>}
          {(activeTab !== 'groups' && (screenWidth < 768 ? isSelected : true)) && <div className={`flex flex-col ${screenWidth < 768 ? `w-full` : `w-[67%]`} h-full border-l border-[var(--border)]`}>
            {chatState.recipient?.name?.length > 0 ? <div className="relative flex flex-col text-[var(--heading)] bg-[var(--background)] h-full">
              <div className="flex gap-4 justify-between items-center w-full bg-[var(--card)] p-4 ">
                <div className="flex items-center gap-2 ">
                  {screenWidth < 768 && <i className="fa-solid fa-arrow-left" onClick={() => setSelected (false)}></i>}
                  <div onClick={() => {
                    setSelectedImage (chatState.recipient?.image?.url);
                    setOpen (true);
                  }}>
                    <Avatar url={chatState.recipient?.image?.url || defaultImage} size={'md'}/>
                  </div>
                  <div className="flex flex-col">
                    {chatState.recipient?.name?.length > 0 && <Link to={`/profile/${chatState.recipient?.username}`} className="hover:underline">{chatState.recipient?.name}</Link>}
                      {chatState.recipient?.name?.length > 0 && chatState.onlineUsers?.includes(chatState.recipient?._id) && 
                        <div className="flex gap-2 items-center">
                          <div className="w-[0.4rem] h-[0.4rem] bg-green-400 rounded-full inline-block"></div>
                          <h2 className="text-[0.7rem] font-extralight">Active Now</h2>
                        </div>}
                  </div>
                </div>
                <i className="fa-solid fa-ellipsis-vertical text-[var(--buttons)] hover:cursor-pointer mr-4"></i>
              </div>
              <div className="p-4 h-full overflow-y-auto w-full mb-16" ref={chatContainerRef}>
                {chatState.messages?.length > 0 && chatState?.messages.map ((message, key) => {
                  if (message.groupId) return null;
                  return (<Message message={message} key={key}/>);
                })}
              </div>
              <div className="absolute bottom-0 pb-4 flex flex-row items-center h-16 bg-[var(--card)] w-full px-4">
                <div className="mt-auto flex flex-col items-center gap-3 p-2 relative w-full">
                  <div className="flex items-center w-full p-2 px-4 rounded-full border border-[var(--input)] relative overflow-x-auto">
                    {/* File Upload Button */}
                    <label htmlFor="file-upload" className="cursor-pointer text-[var(--text)]">
                      <i className="fa-solid fa-paperclip text-sm"></i>
                    </label>

                    <i onClick={() => setShowPicker((prev) => !prev)} className="ml-4 fa-regular fa-face-smile hover:cursor-pointer"></i>

                    {showPicker && (
                      <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}

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
                      className="flex-1 bg-transparent text-[var(--text)] font-normal outline-none ml-2 min-w-0"
                      placeholder="Write a message..."
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (activeTab !== 'groups' && e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                    />
                    {/* Send Button */}
                    <FaPaperPlane
                      onClick={sendMessage}
                      id="send"
                      className="text-[var(--text)] cursor-pointer text-[1rem] ml-2"
                    />
                  </div>
              </div>
              </div>
            </div> : 
            <div className="relative flex flex-col justify-center items-center flex-shrink-0 text-[var(--heading)] bg-[var(--card)] h-full">
              <h2>Select a user to start messaging</h2>
            </div>}
          </div>}
          {(activeTab === 'groups' && (screenWidth < 768 ? isSelected : true)) && <div className={`flex flex-col ${screenWidth < 768 ? `w-full` : `w-[67%]`} h-full border-l border-[var(--border)]`}>
            {groupState.liveGroup?._id?.length > 0 ? <div className="relative flex flex-col text-[var(--heading)] bg-[var(--background)] h-full">
              <div className="flex gap-4 justify-between items-center w-full bg-[var(--topic)] p-2">
                <div className="flex items-center gap-2">
                {screenWidth < 768 && <i className="fa-solid fa-arrow-left" onClick={() => setSelected (false)}></i>}
                  <div onClick={() => {
                    setSelectedImage (groupState.liveGroup?.image?.url);
                    setOpen (true);
                  }}>
                    <Avatar url={groupState.liveGroup?.image?.url || defaultImage} size={'md'}/>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="hover:cursor-pointer" onClick={() => setGroupUpdate(true)}>{groupState.liveGroup?.name}</h2>
                  </div>
                </div>
                <i className="fa-solid fa-ellipsis-vertical text-[var(--buttons)] hover:cursor-pointer mr-4"></i>
              </div>
              <div className="p-4 h-full overflow-y-auto w-full mb-16" ref={chatContainerRef}>
                {groupState.liveGroup?.messages?.length > 0 && groupState.liveGroup?.messages.map ((message, key) => (
                  <Message message={message} key={key}/>
                ))}
              </div>
              <div className="absolute bottom-0 pb-4 flex flex-row items-center h-16 bg-[var(--card)] w-full px-4">
                <div className="mt-auto flex flex-col items-center gap-3 p-2 relative w-full">
                  {groupState.liveGroup?.members?.find((member) => member.userId._id === authState.data._id)?.isActive ? <div className="flex items-center w-full p-2 px-4 rounded-full border border-[var(--input)] relative">
                    {/* File Upload Button */}
                    <label htmlFor="file-upload" className="cursor-pointer text-[var(--text)]">
                      <i className="fa-solid fa-paperclip text-sm"></i>
                    </label>

                    <i onClick={() => setShowPicker((prev) => !prev)} className="ml-4 fa-regular fa-face-smile hover:cursor-pointer"></i>

                    {showPicker && (
                      <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}


                    <input
                      id="file-upload"
                      type="file"
                      encType= "multipart/form-data"
                      multiple
                      onChange={handleGroupFileChange}
                      className="hidden"
                    />
                    {groupFiles?.length > 0 && <div className="ml-3 flex gap-2">
                        {groupFiles?.map ((file, index) => (
                          <div className="flex gap-2 bg-[var(--topic)] px-2" key={index}>
                            {file?.name}
                            <h2 className="hover:cursor-pointer" onClick={() => removeFile (index)}>✕</h2>
                          </div>
                        ))}
                      </div>}
                    {/* Message Input */}
                    <input
                      type="text"
                      value={groupMessage}
                      className="flex-1 bg-transparent text-[var(--text)] font-normal outline-none ml-4 min-w-0"
                      placeholder="Write a message..."
                      onChange={(e) => setGroupMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (activeTab === 'groups' && e.key === 'Enter') {
                          sendGroupMessage();
                        }
                      }}
                    />
                    {/* Send Button */}
                    <FaPaperPlane
                      onClick={sendGroupMessage}
                      id="send"
                      className="text-[var(--text)] cursor-pointer text-[1rem] ml-2"
                    />
                  </div> : 
                  <h2 className="text-xs">You are no longer a participant of this group</h2>}
              </div>
              </div>
            </div> : 
            <div className="relative flex flex-col justify-center items-center flex-shrink-0 text-[var(--heading)] bg-[var(--card)] h-full">
              <h2>Select a group to start messaging</h2>
            </div>}
          </div>}
        </div>
      </div>
  );
};

export default Messenger;
