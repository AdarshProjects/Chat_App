import React, { useEffect } from 'react'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Signuppage from './pages/Signuppage'
import Loginpage from './pages/Loginpage'
import Settingspage from './pages/Settingspage'
import ProfilePic from './pages/ProfilePic'
import { useAuthstore } from './store/useAuthstore.js'
import  { Loader } from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemestore } from './store/useThemestore.js'
import Navbar from './components/Navbar.jsx'

export default function App() {
  const {authUser, checkAuth, IsCheckingAuth, onlineUsers} = useAuthstore();
  const {theme} = useThemestore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  console.log("onlineusers",{onlineUsers});
  console.log({authUser})
  console.log({IsCheckingAuth})

  if(IsCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div data-theme={theme}>
        <Navbar/>
        <Routes>
          <Route path="/" element={ authUser ? <Homepage/> : <Navigate to="login"/>}/>
          <Route path="/signup" element={ !authUser ? <Signuppage/>: <Navigate to="/"/>}/>
          <Route path="/login" element={ !authUser ? <Loginpage />: <Navigate to="/" />}/>
          <Route path="/settings" element={<Settingspage/>}/>
          <Route path="/profilepic" element={ authUser ? <ProfilePic/>: <Navigate to="/login"/>}/>
        </Routes>

        <Toaster/>
    </div>
  )
}
