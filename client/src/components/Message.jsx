import { useSelector } from "react-redux";

function Message ({ message }) {
    console.log (message.userId);
    const authState = useSelector ((state) => state.auth);
    return (
        <div className={`flex ${message.userId !== authState.data?._id ? `justify-start` : `justify-end`} items-center gap-4 mt-4 w-full`}>
            {message.userId !== authState.data?._id &&
                <div className="flex w-8 items-center">
                    <img className="rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>}
            <div className="bg-[var(--topic)] px-4 py-2 rounded-full">{message.message}</div>
            {message.userId === authState.data?._id &&
                <div className="w-8">
                    <img  className="rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>}
        </div>
    )
}

export default Message;