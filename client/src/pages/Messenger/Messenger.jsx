import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Avatar from "../../components/Avatar";

const Messenger = () => {
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

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    setChats((prev) => ({
      ...prev,
      [selectedUser]: [...prev[selectedUser], message],
    }));
    setMessage("");
  };

  return (
    <div className={`fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[70%] h-[82vh] md:h-[97vh] flex flex-col p-4 flex-grow overflow-y-auto`}>
      {/* Left Sidebar */}
      <h2 className={`heading text-[2rem]`}>Messenger</h2>
      <div className="flex h-full">
        <div className={`w-1/3 md:w-1/4 bg-transparent border-r-[1px] p-4`}>
            <h2 className={`text-xl text-white bg-trnsparent font-semibold mb-2`}>Recent Chats</h2>
            <ul>
            {chats.map((user, index) => (
                <li
                key={index}
                className={`flex items-center p-2 gap-2 cursor-pointer transition ${
                    selectedUser === index ? `text-black bg-blue-100` : `text-black`
                }`}
                onClick={() => setSelectedUser(index)}
                >
                <Avatar url={user?.image} size={'md'}/>
                <span className="text-sm">{user?.name}</span>
                </li>
            ))}
            </ul>
        </div>

        {/* Right Chatbox */}
        <div className="w-2/3 md:w-3/4 flex flex-col bg-transparent shadow-lg">
            {selectedUser !== -1 ? (
            <>
                <div className={`p-4 text-white text-lg font-semibold`}>
                {chats[selectedUser].name}
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {chats[selectedUser].messages.map((msg, index) => (
                    <div
                    key={index}
                    className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                        index % 2 === 0
                        ? `text-white self-end ml-auto`
                        : "bg-gray-300 text-black self-start"
                    }`}
                    >
                    {msg}
                    </div>
                ))}
                </div>
                <div className="p-3 flex items-center">
                <input
                    type="text"
                    className="flex-1 text-white focus:outline-none p-2 px-3 border rounded-lg"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="ml-2 p-3 text-white rounded-lg"
                    onClick={sendMessage}
                >
                    <i className={`text-white fa-solid fa-paper-plane`}></i>
                </button>
                </div>
            </>
            ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500">
                Select a chat to start messaging
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
