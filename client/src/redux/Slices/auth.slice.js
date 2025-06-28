import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    notifications: JSON.parse(localStorage.getItem("notifications")) || [],
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    isRead: localStorage.getItem("isRead") === "true",
    userList: [],
    topUsers: []
};


export const sendOtp = createAsyncThunk('/auth/sendotp',async(data, { dispatch }) => {
    try {
        const response = await axiosInstance.post("auth/sendotp",data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        localStorage.setItem("email", data.email);
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const verifyOtp = createAsyncThunk('/auth/verifyotp',async(data, { dispatch }) =>  {
    try {
        const response = await axiosInstance.post("auth/verifyotp",data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const login = createAsyncThunk('/auth/login', async (data, { dispatch }) =>  {    
    try {
        const response = await axiosInstance.post("auth/signin", data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const signup = createAsyncThunk('/auth/signup', async (data, { dispatch }) =>  {     
    try {
        const response = await axiosInstance.post("auth/signup", data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const forgetPass = createAsyncThunk('auth/forget',async(data, { dispatch }) =>  {
    try {
        const response = await axiosInstance.post('auth/forgetpass',data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const resetPass = createAsyncThunk('auth/reset',async(data, { dispatch }) =>  {
    try {
        const response = await axiosInstance.post(`auth/resetpass/${data.token}`,data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const getUserById = createAsyncThunk('/auth/user', async (id, { dispatch }) =>  {     
    try {
        const response = await axiosInstance.get(`auth/users/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const getUserByUsername = createAsyncThunk('/auth/user', async (username, { dispatch }) =>  {     
    try {
        const response =  await axiosInstance.get(`auth/user/${username}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const getUserByLimit = createAsyncThunk('/auth/userByLimit', async (data, { dispatch }) =>  {     
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

        if (!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const getTopUsers = createAsyncThunk('/auth/topUsers', async (_, { dispatch }) =>  {     
    try {
        const response = await axiosInstance.get(`auth/topUsers`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        if (!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const followRequest = createAsyncThunk('/auth/followRequest' , async(data, { dispatch }) =>  {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`auth/follow-request/${data.id1}` , resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const followUser = createAsyncThunk('/auth/follow' , async(data, { dispatch }) =>  {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`auth/follow/${data.id1}` , resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const updateUser = createAsyncThunk('/user/update' , async(data, { dispatch }) =>  {
    try {
        const response = await axiosInstance.patch("auth", data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const deleteUser = createAsyncThunk('/user/delete', async (userId, { dispatch }) =>  {
    try {
        const response = await axiosInstance.delete(`auth/${userId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if (!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));   
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const searchUser = createAsyncThunk('search/user',async(query, { dispatch }) =>  {
    try {
        const response = await axiosInstance.get(`auth/search/${query}` ,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const searchFollower = createAsyncThunk('searchFollower',async(data, { dispatch }) =>  {
    try {
        const response = await axiosInstance.get('auth/searchFollower' , {
            params: data,
            headers: {
            'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const getFollowerDetails = createAsyncThunk('followerDetails' ,async(id, { dispatch }) =>  {
    try {
        const response = await axiosInstance.get(`auth/follower/${id}`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
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
            state.notifications = [];
            state.isRead = false;
        },
        markAsRead: (state) => {
            state.isRead = true;
            localStorage.setItem("isRead", true);
        },
        deleteFR: (state, action) => {
            const notificationToDelete = action.payload;
          
            state.notifications = state.notifications.filter(
              (notification) => notification._id !== notificationToDelete._id
            );
            localStorage.setItem("notifications", JSON.stringify(state.notifications));
        },
        addNotification: (state, action) => {
            const exists = state.notifications?.some(
                (notif) => notif._id === action.payload._id
            );
            if (!exists) {
                // toast("New notification", {
                //     icon: "🔔",
                //     duration: 1000,
                // });
                state.isRead = false;
                state.notifications.unshift(action.payload);
                localStorage.setItem("notifications", JSON.stringify(state.notifications));
            }
        },
        updateFollowingList: (state, action) => {
            state.data.following.push(action.payload);
            localStorage.setItem("data", JSON.stringify(state.data));
        },
        updateFollowerList: (state, action) => {
            state.data.follower.push(action.payload);
            localStorage.setItem("data", JSON.stringify(state.data));
        }
    }, 
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.isLoggedIn = (action.payload.data?.token != undefined);
            state.data = action.payload.data?.userdata;
            state.token = action.payload.data?.token;
            state.notifications = action.payload.data?.notifications;
            state.isRead = false;
            localStorage.setItem("token", action.payload.data?.token);
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userdata));
            localStorage.setItem("isLoggedIn", (action.payload.data?.token != undefined));
            localStorage.setItem("notifications", JSON.stringify(action.payload.data?.notifications));
            localStorage.setItem("isRead", false);
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
        .addCase (getTopUsers.fulfilled, (state, action) => {
            if (!action.payload) return;
            state.topUsers = action.payload.data.users;
        })
    }
});

export const { logout, markAsRead, deleteFR, addNotification, updateFollowingList, updateFollowerList } = authSlice.actions;
export default authSlice.reducer;