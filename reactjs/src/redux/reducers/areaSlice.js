import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    selectedArea : localStorage.getItem('selectedarea') || null

}

const areaSlice = createSlice({
  name:'area',
  initialState,
  reducers:{
    setArea:(state, action)=>{
    state.selectedArea = action.payload;
    localStorage.setItem('selectedarea', action.payload);
    }
  }  
});

export const {setArea} = areaSlice.actions;
export default areaSlice.reducer