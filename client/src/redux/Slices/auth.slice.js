import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    userList: []
};


export const sendOtp = createAsyncThunk('/auth/sendotp',async(data) => {
    try {
        const response = await axiosInstance.post("auth/sendotp",data);
        if(!response) toast.error('Something went wrong, try again');
        localStorage.setItem("email", data.email);
        return  response;
    } catch (error) {
        console.log(error);
    }
});

export const verifyOtp = createAsyncThunk('/auth/verifyotp',async(data) => {
    try {
        const response = await axiosInstance.post("auth/verifyotp",data);
        if(!response) toast.error('Something went wrong, try again');
        return  response;
    } catch (error) {
        console.log(error);
    }
});

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

export const forgetPass = createAsyncThunk('auth/forget',async(data) => {
    try {
        const response = await axiosInstance.post('auth/forgetpass',data);
        if(!response) toast.error('Something went wrong, try again');
        return  response;
    } catch (error) {
        console.log(error);
    }
})

export const resetPass = createAsyncThunk('auth/reset',async(data) => {
    try {
        const response = await axiosInstance.post(`auth/resetpass/${data.token}`,data);
        if(!response) toast.error('Something went wrong, try again');
        return  response;
    } catch (error) {
        console.log(error);
    }
})

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

export const getUserByLimit = createAsyncThunk('/auth/userByLimit', async (data) => {     
    try {
        const response = await axiosInstance.get(`auth/usersByLimit`, {
            params: {
                userId: data.userId,
                limit: data.limit
            },
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        if (!response) toast.error('Something went wrong, try again');
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

export const deleteUser = createAsyncThunk('/user/delete', async (userId) => {
    try {
        const response = await axiosInstance.delete(`auth/${userId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if (!response) toast.error('Something went wrong, try again');
        else toast.success(response.data.msg);       
        return response;
    } catch (error) {
        console.log(error.response);
        toast.error(error.response?.data?.msg || 'An error occurred');
    }
});

export const searchUser = createAsyncThunk('search/user',async(query) => {
    try {
        const response = await axiosInstance.get(`auth/search/${query}` ,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        toast.error(error.response?.data?.msg || 'An error occurred');
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
            state.data = action.payload.data?.userDetails;
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userDetails));
        })
        .addCase(updateUser.fulfilled, (state,action) => {
            if(!action.payload) return;
            state.data = action.payload?.data?.userDetails;
            localStorage.setItem("data", JSON.stringify(action.payload?.data?.userDetails));
        })
        .addCase(deleteUser.fulfilled, (state,action) => {
            if(!action.payload) return;
            localStorage.clear();
            state.data = "";
            state.isLoggedIn = false;
            state.token = "";
        })
        .addCase (getUserByLimit.fulfilled, (state, action) => {
            if (!action.payload) return;
            state.userList = action.payload.data?.users;
        })
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;