import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedPulse: [],
};

export const getAllPulse = createAsyncThunk('posts/getAllPulse', async () => {
    try {
        const response = await axiosInstance.get('pulse', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        toast.error(error.message || "Failed to fetch pulses");
    }
});

export const createPulse = createAsyncThunk('post/createPulse', async (pulseData) => {
    try {
        const response = await axiosInstance.post('pulse', pulseData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        console.log (error.message);
        toast.error(error.message || "Failed to create post");
    }
});

export const likePulse = createAsyncThunk('pulse/likePulse', async(data) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`pulse/like/${data._id}`,resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.message || "Failed to like Pulse");
    }
})

// export const getPostByUserId = createAsyncThunk('post/getpost' ,async(id) => {
//     try {
//         const response = await axiosInstance.get(`post/posts/${id}`, { 
//             headers: {
//                 'x-access-token': localStorage.getItem('token')
//             }
//         })
//         if(response){
//             return response;
//         }
//     } catch (error) {
//         toast.error(error.message || "Failed to get post");
//     }
// })

// export const getSavedPost = createAsyncThunk('post/getSavedPost' , async(id) => {
//     try {
//         const response = await axiosInstance.get(`post/save/${id}`, {
//             headers: {
//                 'x-access-token': localStorage.getItem('token')
//             }
//         })
//         if(response){
//             return response;
//         }
//     } catch (error) {
//         toast.error(error.message || "Failed to save post");
//     }
// })

// export const updateSavedPost = createAsyncThunk('post/updatesavedPost', async(data) => {
//     try {
//         const resp = {
//             id : data.id
//         }
//         const response = await axiosInstance.patch(`post/save/${data._id1}`,resp , {
//             headers: {
//                 'x-access-token': localStorage.getItem('token')
//             }
//         })
//         if(response){
//             return response;
//         }
//     } catch (error) {
//         toast.error(error.message || "Failed to update post");
//     }
// })

const PulseSlice = createSlice({
    name: 'pulse',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllPulse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.downloadedPulse = action.payload?.data?.pulseData?.pulse.reverse();
            })
            .addCase(createPulse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                const newPulse = action.payload?.data?.pulseData?.pulse;
                state.downloadedPulse = [newPulse, ...state.downloadedPulse];
            })
    }
});

export default PulseSlice.reducer;
