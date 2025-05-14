import React, {useState, useEffect} from "react";
import {useDispatch, useSelector } from 'react-redux';
import { setArea } from "../redux/reducers/areaSlice";
import {useNavigate} from 'react-router-dom'
 
const Landing = ()=>{
const {selectedArea, SetSelectedAra} = useState('');
const dispatch = useDispatch();
const navigate = useNavigate();

useEffect(()=>{
    if(selectedArea){
        
    }
})
}
export default Landing;
