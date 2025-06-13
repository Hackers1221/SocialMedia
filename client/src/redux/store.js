import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/auth.slice';
import postSliceReducer from './Slices/post.slice'
import pulseSliceReducer from './Slices/pulse.slice'
import commentSliceReducer from './Slices/comment.slice'
import announcementSliceReducer from './Slices/announcement.slice'
import chatSliceReducer from './Slices/chat.slice'
import socketSliceReducer from "./Slices/socket.slice";
import notificationSliceReducer from "./Slices/notification.slice"
import groupSliceReducer from "./Slices/group.slice"
import themeSliceReducer from './Slices/theme.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        post: postSliceReducer,
        pulse: pulseSliceReducer,
        comment: commentSliceReducer,
        announcement: announcementSliceReducer,
        chat: chatSliceReducer,
        socket: socketSliceReducer,
        notification: notificationSliceReducer,
        group: groupSliceReducer,
        theme: themeSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;