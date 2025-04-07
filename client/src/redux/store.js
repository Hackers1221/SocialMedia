import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/auth.slice';
import postSliceReducer from './Slices/post.slice'
import pulseSliceReducer from './Slices/pulse.slice'
import commentSliceReducer from './Slices/comment.slice'
import verseSliceReducer from './Slices/verse.slice'
import chatSliceReducer from './Slices/chat.slice'
import socketReducer from "./Slices/socket.slice";

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        post: postSliceReducer,
        pulse: pulseSliceReducer,
        comment: commentSliceReducer,
        verse: verseSliceReducer,
        chat: chatSliceReducer,
        socket: socketReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;