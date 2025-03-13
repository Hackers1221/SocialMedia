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
        const response = await axiosInstance.post("auth/signin", data);
        if(!response) toast.error('Something went wrong, try again');
        return  response;
    } catch (error) {
        console.log(error);
    }
});

export const signup = createAsyncThunk('/auth/signup', async (data) => {     
    try {
        const response = await axiosInstance.post("auth/signup", data);
        if(!response) toast.error('Something went wrong, try again');
        return  response;
    } catch (error) {
        console.log(error);
    }
});

export const getUserById = createAsyncThunk('/auth/user', async (id) => {     
    try {
        const response = await axiosInstance.get(`auth/users/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) toast.error('Something went wrong, try again');
        return  response;
    } catch (error) {
        console.log(error);
    }
});

export const getUserByUsername = createAsyncThunk('/auth/user', async (username) => {     
    try {
        const response =  await axiosInstance.get(`auth/user/${username}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) toast.error('Something went wrong, try again');
        return response;
    } catch (error) {
        console.log(error);
    }
});

export const followUser = createAsyncThunk('/auth/follow' , async(data) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`auth/follow/${data.id1}` , resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) toast.error('Something went wrong, try again');
        return response;
    } catch (error) {
        console.log(error);
    }
})

export const updateUser = createAsyncThunk('/user/update' , async(data) => {
    try {
        const response = await axiosInstance.patch("auth", data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) toast.error('Something went wrong, try again');
        return response;
    } catch (error) {
        console.log(error.response);
        toast.error(error.response.data.msg);
    }
})


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
            state.isLoggedIn = (action.payload.data?.token != undefined);
            state.data = action.payload.data?.userdata;
            state.token = action.payload.data?.token;
            localStorage.setItem("token", action.payload.data?.token);
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userdata));
            localStorage.setItem("isLoggedIn", (action.payload.data?.token != undefined));
        })
        .addCase(followUser.fulfilled , (state,action) => {
            if(!action.payload)return;
            console.log(action.payload);
            state.data = action.payload.data?.userDetails;
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userDetails));
        })
        .addCase(updateUser.fulfilled, (state,action) => {
            if(action.payload){
                state.data = action.payload?.data?.userDetails;
                localStorage.setItem("data", JSON.stringify(action.payload?.data?.userDetails));
            }
        })
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;