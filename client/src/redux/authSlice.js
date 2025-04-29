import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile: null,
        selectedUser: null,
    },
    reducers:{
        //actions
        setAuthUser:(state, action)=>{
            state.user = action.payload;
        },
        setsuggestedUsers:(state, action)=>{
            state.suggestedUsers = action.payload;
        },
        setuserProfile:(state, action)=>{
            state.userProfile = action.payload;
        },
        setselectedUser:(state, action)=>{
            state.selectedUser = action.payload;
        }
    }
})
export const {setAuthUser, setsuggestedUsers, setuserProfile, setselectedUser} = authSlice.actions;
export default authSlice.reducer;