import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducers/authSlice";
import areaReducer from "../redux/reducers/areaSlice";

export const store = configureStore({
    reducer:{
        area:areaReducer,
        auth:authReducer
    }
})