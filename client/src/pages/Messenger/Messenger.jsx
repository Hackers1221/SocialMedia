import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Avatar from "../../components/Avatar";
import { useDispatch } from "react-redux";
import { socket } from "../../utils/socket";

const Messenger = () => {
  const dispatch = useDispatch ();

  const [selectedUser, setSelectedUser] = useState(-1);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([
    {
      name: "John Doe",
      image: "https://robohash.org/11.png",
      messages: ["Hey!", "How are you?", "Let's catch up soon!"],
    },
    {
      name: "Alice Smith",
      image: "https://robohash.org/23.png",
      messages: ["Hello!", "What's up?", "Are you free tomorrow?"],
    },
    {
      name: "Bob Johnson",
      image: "https://robohash.org/32.png",
      messages: ["Hi there!", "How's your day going?", "Wanna grab coffee?"],
    },
    {
      name: "Emma Wilson",
      image: "https://robohash.org/19.png",
      messages: ["Good morning!", "Did you check that email?", "See you soon!"],
    },
    {
      name: "David Brown",
      image: "https://robohash.org/28.png",
      messages: ["Hey buddy!", "Long time no see!", "Let's plan something!"],
    },
    {
      name: "Sophia Lee",
      image: "https://robohash.org/31.png",
      messages: ["Hi!", "Are we still on for tonight?", "Can't wait!"],
    },
  ]);

  useEffect (() => {
    socket.connect();

    socket.on("receiveMessage", (data) => {
      // dispatch(addMessage(data));
      console.log (`${data} Message rescived`)
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = { text: message, sender: "User", timestamp: new Date() };
      socket.emit("message", msgData);
      // dispatch(addMessage(msgData));
      setMessage("");
    }
  };

  

  return (
    <div className={`fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[70%] h-[82vh] md:h-[97vh] flex flex-col p-4 flex-grow overflow-y-auto`}>
      {/* Left Sidebar */}
      <h2 className={`heading text-[2rem] text-[var(--heading)]`}>Messenger</h2>
      <div className="flex h-[85vh] antialiased">
        <div className="flex flex-row h-full w-full overflow-x-hidden ">
          <div className="flex flex-col pl-6 pr-2 w-64 text-[var(--heading)] bg-[var(--card)] flex-shrink-0">
            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs ">
                <span className="font-bold">Active Conversations</span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
                {chats?.length > 0 && chats?.map ((chat, index) => (
                  <button className="flex flex-row items-center hover:shadow-md border-l border-transparent hover:border-white p-2" key={index}>
                    <img src={chat?.image} className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"/>
                    <div className="ml-2 text-sm font-semibold">{chat?.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full border-l">
            <div className="relative  flex flex-col flex-auto flex-shrink-0 text-[var(--heading)] bg-[var(--card)] h-full p-4">
              <div className="absolute bottom-4 flex flex-row items-center h-16 bg-transparent w-full px-4">
                <div className="mt-auto flex items-center gap-3 p-2 relative w-full">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      className={`w-full p-2 px-4 pr-10 rounded-full text-[var(--text)] border border-[var(--input)] bg-transparent font-normal outline-none focus:shadow-md`}
                      placeholder="Write a message..."
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <FaPaperPlane onClick={sendMessage} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text)] cursor-pointer`} />
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
