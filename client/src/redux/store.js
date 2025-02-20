import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/auth.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;