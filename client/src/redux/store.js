import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/auth.slice';
import postSliceReducer from './Slices/post.slice'
import pulseSliceReducer from './Slices/pulse.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        post: postSliceReducer,
        pulse: pulseSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;