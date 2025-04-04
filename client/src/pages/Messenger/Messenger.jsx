import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import useSocket from "../../hooks/useSocket";
import User from '../../components/User'

const Messenger = () => {
  const authState = useSelector ((state) => state.auth);
  const chatState = useSelector ((state) => state.chat);

  const socket = useSocket ();

  const dispatch = useDispatch ();

  const [selectedUser, setSelectedUser] = useState();
  const [message, setMessage] = useState([]);

  const messages = [
    {
      userId: "67d517f4ac6b48600f83b972",
      message: "Dealer chotu"
    }, 
    {
      userId: "67dbb7a367790a1f9a223144",
      message: "Yes dealer is chotu"
    }, 
    {
      userId: "67dbb7a367790a1f9a223144",
      message: "Dealer Sai ka hai"
    }, 
    {
      userId: "67d517f4ac6b48600f83b972",
      message: "arey haa"
    }, 
  ]
  
    const sendMessage = () => {
      if (message.trim()) {
        socket.emit("sendMessage", {
          sender: authState.data?._id,
          recipient: '67e1a5918422526b1903af1b',
          content: message
        });
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
                {authState.data?.following?.length > 0 && authState.data?.following?.map ((user, index) => (
                  <User userId={user} key={index}/>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full border-l">
            <div className="relative  flex flex-col flex-auto flex-shrink-0 text-[var(--heading)] bg-[var(--card)] h-full">
              <div className="flex gap-4 items-center w-full bg-[var(--topic)] p-2">
                <Avatar url='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' size={'md'}/>
                <h2>Rounak</h2>
              </div>
              <div className="p-4">
                {chatState.messages?.length > 0 && chatState?.messages.map ((message, key) => (
                  <Message message={message} key={key}/>
                ))}
              </div>
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
