import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';
 import Landing from './components/landing';
//import Login from './components/login'
import Register from './components/register';

const App = () =>{
  return(
    <BrowserRouter>
  <Routes>
  <Route path='/' element={<Landing/>} />
  <Route path='register' element={<Register/>} />

  </Routes>
  </BrowserRouter>
  )
  
}

export default App;
