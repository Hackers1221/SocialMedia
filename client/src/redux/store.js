import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/auth.slice';
import postSliceReducer from './Slices/post.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        posts: postSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;