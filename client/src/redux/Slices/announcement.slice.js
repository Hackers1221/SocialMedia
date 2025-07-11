import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {
    downloadedAnnouncement: [],
    announcementList: [],
    savedList:[],
};

export const getAllAnonuncement = createAsyncThunk('announcement/getAllAnouncement', async (id, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`announcement/announcement/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response?.data?.error || "Failed to fetch announcement", type: 'error' }));
    }
});

export const createAnnouncement = createAsyncThunk('announcement/createAnouncement', async (data, { dispatch }) => {
    try {
        const response = await axiosInstance.post('announcement/announcement', data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response?.data?.error || "Failed to create announcement", type: 'error' }));
    }
});

// export const updateVerse = createAsyncThunk('announcement/updateVerse',async(id, verseData) => {
//     try {
//         const response = await axiosInstance.patch(`announcement/announcement/${id}`, verseData , {
//             headers: {
//                 'x-access-token': localStorage.getItem('token')
//             }
//         });
//         if(response){
//             return response;
//         }
//     } catch (error) {
//         toast.error(error.response?.data?.error || "Failed to update verse");
//     }
// })

export const congratulate = createAsyncThunk('announcement/congratulate', async(data, { dispatch }) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`announcement/congratulate/${data._id}`, resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response?.data?.error || "Failed to congratulate!", type: 'error' }));
    }
})

export const sorrify = createAsyncThunk('announcement/sorrify', async(data, { dispatch }) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`announcement/sorrify/${data._id}`, resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response?.data?.error || "Failed to sorrify announcement!", type: 'error' }));
    }
})

// export const getVerseByUserId = createAsyncThunk('verse/getVerse' ,async(id) => {
//     try {
//         const response = await axiosInstance.get(`verse/verse/${id}`, { 
//             headers: {
//                 'x-access-token': localStorage.getItem('token')
//             }
//         })
//         if(response){
//             return response;
//         }
//     } catch (error) {
//         toast.error(error.response?.data?.error || "Failed to get verse");
//     }
// })

// export const getVerseById = createAsyncThunk('verse/getVerseById' ,async(id) => {
//     try {
//         const response = await axiosInstance.get(`verse/${id}`, { 
//             headers: {
//                 'x-access-token': localStorage.getItem('token')
//             }
//         })
//         if(response){
//             return response;
//         }
//     } catch (error) {
//         toast.error(error.response?.data?.error || "Failed to get verse");
//     }
// })

export const deleteAnnouncement = createAsyncThunk('announcement/delete' , async(id) => {
    try {        
        const response = axiosInstance.delete(`announcement/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response) return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response?.data?.error || "Failed to delete announcement!", type: 'error' }));
    }
})

const AnnouncementSlice = createSlice({
    name: 'announcement',
    initialState,
    reducers: {
        // filterVerseByUser: (state, action) => {
        //     const id = action.payload?.id;
        //     state.verseList = JSON.parse(JSON.stringify(state.downloadedVerse)).filter((verse) => verse.userId === id);
        //     state.verseList = JSON.parse(JSON.stringify(state.verseList));
        // },
        // filterVerseByLiked: (state, action) => {
        //     const id = action.payload?.id;
        //     state.verseList = JSON.parse(JSON.stringify(state.downloadedVerse)).filter((verse) => verse.likes?.includes (id));
        //     state.verseList = JSON.parse(JSON.stringify(state.verseList));
        // },
        // filterVerseByFollowing: (state, action) => {
        //     const following = action.payload?.following;
        //     state.verseList = JSON.parse(JSON.stringify(state.downloadedVerse)).filter((verse) => following.includes(verse.userId));
        //     state.verseList = JSON.parse(JSON.stringify(state.verseList));
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAnonuncement.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.downloadedAnnouncement = action.payload?.data?.announcement?.Announcement?.reverse();
                state.announcementList = state.downloadedAnnouncement;
            })
            .addCase(createAnnouncement.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                const newAnnouncement = action.payload?.data?.announcement?.announcement;
                if (state.downloadedAnnouncement?.length > 0) state.downloadedAnnouncement = [newAnnouncement, ...state.downloadedAnnouncement];
                else state.downloadedAnnouncement = [newAnnouncement];
            })
            .addCase(deleteAnnouncement.fulfilled, (state, action) => {
                if (!action.payload.data) return;
                state.downloadedAnnouncement = state.downloadedAnnouncement.filter ((announcement) => announcement._id != action.payload.data?.announcement._id);
            })
            .addCase (congratulate.fulfilled, (state, action) => {
                if (!action.payload.data) return;
                state.downloadedAnnouncement = state.downloadedAnnouncement.map (announcement =>
                    announcement._id === action.payload.data?.announcement?._id ? action.payload.data?.announcement : announcement
                );
            })
            .addCase (sorrify.fulfilled, (state, action) => {
                if (!action.payload.data) return;
                state.downloadedAnnouncement = state.downloadedAnnouncement.map (announcement =>
                    announcement._id === action.payload.data?.announcement?._id ? action.payload.data?.announcement : announcement
                );
            })
            // .addCase(updateVerse.fulfilled, (state, action) => {
            //     if (!action.payload?.data) return;
            // })
            // .addCase(getVerseByUserId.fulfilled , (state,action) => {
            //     if(!action.payload?.data)return; 
            //     state.verseList = action.payload?.data?.verse?.reverse();
            // })
    }
});

export const { } = AnnouncementSlice.actions;

export default AnnouncementSlice.reducer;
