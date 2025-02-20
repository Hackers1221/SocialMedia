import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
};

export const login = createAsyncThunk('/auth/login', async (data) => {    
    try {
        const response = axiosInstance.post("auth/signin", data);
        if(!response) toast.error('Something went wrong, try again');
        return await response;
    } catch (error) {
        console.log(error);
    }
});

export const signup = createAsyncThunk('/auth/signup', async (data) => {     
    try {
        const response = axiosInstance.post("auth/signup", data);
        if(!response) toast.error('Something went wrong, try again');
        return await response;
    } catch (error) {
        console.log(error);
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.clear();
            state.data = "";
            state.isLoggedIn = false;
            state.token = "";
        }
    }, 
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            if(!action.payload) return;
            // console.log (action.payload);
            state.isLoggedIn = (action.payload.data?.token != undefined);
            state.data = action.payload.data?.userdata;
            state.token = action.payload.data?.token;
            localStorage.setItem("token", action.payload.data?.token);
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userdata));
            localStorage.setItem("isLoggedIn", (action.payload.data?.token != undefined));
        })
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;