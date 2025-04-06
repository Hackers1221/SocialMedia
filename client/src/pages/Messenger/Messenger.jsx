import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import useSocket from "../../hooks/useSocket";
import User from '../../components/User'
import { X } from "lucide-react";

const Messenger = () => {
  const authState = useSelector ((state) => state.auth);
  const chatState = useSelector ((state) => state.chat);

  const socket = useSocket ();

  const [message, setMessage] = useState([]);
  const chatContainerRef = useRef(null);
  const[activeTab, setActiveTab] = useState ('recent');
  
    const sendMessage = () => {
      if (message.trim()) {
        socket.emit("sendMessage", {
          sender: authState.data?._id,
          recipient: chatState.recipient?._id,
          content: message
        });
        setMessage("");
      }
    };  

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [chatState.messages]);

  return (
    <div className={`fixed top-[9rem] md:top-0 md:left-[20rem] left-[1rem] w-[85%] md:w-[75%] h-[82vh] md:h-[100vh] flex flex-col p-4 flex-grow overflow-y-auto`}>
      {/* Left Sidebar */}
        <div className="flex flex-row h-full w-full overflow-x-hidden ">
          <div className="flex flex-col pt-4 px-4 w-64 text-[var(--heading)] bg-[var(--card)] flex-shrink-0">
            <h2 className={`heading text-[2rem] text-[var(--heading)]`}>Messenger</h2>
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
                        activeTab === "contacts" ? `text-[var(--buttons)]` : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab("contacts")}
                    >
                      <span>Contacts</span>
                    </button>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
                {authState.data?.following?.length > 0 && authState.data?.following?.map ((user, index) => (
                  <User userId={user} key={index}/>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[75%] h-full border-l border-[var(--border)]">
            {chatState.recipient?.name?.length > 0 ? <div className="relative flex flex-col text-[var(--heading)] bg-[var(--card)] h-full">
              <div className="flex gap-4 items-center w-full bg-[var(--topic)] p-2">
                <Avatar url={chatState.recipient?.image} size={'md'}/>
                <h2>{chatState.recipient?.name}</h2>
              </div>
              <div className="p-4 h-full overflow-y-auto w-full mb-16" ref={chatContainerRef}>
                {chatState.messages?.length > 0 && chatState?.messages.map ((message, key) => (
                  <Message message={message} key={key}/>
                ))}
              </div>
              <div className="absolute bottom-0 pb-4 flex flex-row items-center h-16 bg-[var(--card)] w-full px-4">
                <div className="mt-auto flex items-center gap-3 p-2 relative w-full">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      className={`w-full p-2 px-4 pr-10 rounded-full text-[var(--text)] border border-[var(--input)] bg-transparent font-normal outline-none focus:shadow-md`}
                      placeholder="Write a message..."
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage ();
                        }
                      }}
                    />
                    <FaPaperPlane onClick={sendMessage} id="send" className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text)] cursor-pointer`} />
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
