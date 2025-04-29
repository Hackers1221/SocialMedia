import React from 'react';
import NotificationItem from '../../components/NotificationItem';
import { useDispatch, useSelector } from 'react-redux';
import { rejectFR, acceptFR } from '../../redux/Slices/notification.slice';
import { deleteFR, updateFollowerList } from '../../redux/Slices/auth.slice';

function Notification() {
  const dispatch = useDispatch();
  const authState = useSelector ((state) => state.auth);
  const socket = useSelector((state) => state.socket.socket);

  const handleFollowAccept = async (Item) => {
    const response = await dispatch(acceptFR({ sender: Item.sender._id, recipient: Item.recipient}));

    if(response.payload) {
      if (socket && socket.connected) {
        socket.emit("follow-accepted", {sender: Item.sender._id, recipient: Item.recipient});
      }
    }
    dispatch(updateFollowerList(Item.sender._id));
    dispatch(deleteFR(Item));
  };

  const handleFollowDecline = async (Item) => {
    await dispatch(rejectFR({ sender: Item.sender._id, recipient: Item.recipient}));
    dispatch(deleteFR(Item));
  };


  return (
    <div className={`fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto`}>
      <div className="max-w-5xl w-full flex flex-col space-y-4">
        {/* Header */}
        <h2 className={`text-[var(--text)] heading text-[2rem] mb-4`}>Notifications</h2>

        {authState?.notifications?.length > 0 ? authState?.notifications?.map((Item, index) => (
            <div key={index}>
                <NotificationItem 
                  Item={Item}
                  onAccept={() => handleFollowAccept(Item)}
                  onDecline={() => handleFollowDecline(Item)}
                />
            </div>
        )) : <h2 className={`w-full text-center font-extralight text-[var(--text)]`}>No Notifications for you!</h2>}
      </div>
    </div>
  );
}

export default Notification;
