import { createSlice } from "@reduxjs/toolkit";

const LoadingSlice = createSlice({
    name:"loading",
    initialState: {
        loading:false
    },
    reducers:{
        Loading : ((state,actions)=>{
        state.loading = actions.payload
        })
    }
});


export const {Loading} = LoadingSlice.actions
export default LoadingSlice.reducer