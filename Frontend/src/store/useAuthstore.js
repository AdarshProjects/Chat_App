import {create} from "zustand";
import axios from "axios"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api": "/";
export const useAuthstore = create((set, get)=> ({
    authUser: null,
    IssigningUp: false,
    IsloggingIn:false,
    IsUpdatingProfile: false,
    onlineUsers : [],
    IsCheckingAuth: true,
    socket: null,

    checkAuth: async()=>{
        try {
            const res= await axiosInstance.get("/auth/check")
            set ({authUser : res.data})
            get().connectSocket();
        } catch (error) {
            console.log("error in check auth", error)
            set({authUser: null})
        } finally {
            set ({ IsCheckingAuth: false});
        }
    },
    
    signup: async(data) => {
        set({IssigningUp: true});
        try {
            const res = await  axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Accound created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message); 
        } finally {
            set({ issigningup : false});
        }
    },

    login : async(data) => {
        set({IsloggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ IsloggingIn : false});
        }
    },

    logout: async() => {
        try {
            axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("loggedout succesfully");
            get().DisconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async(data)=>{
        set ({ IsUpdatingProfile : false});
        try {
            const res = await axiosInstance.put("/auth/update", data);
            set({ authUser : res.data.updateuser });
            console.log("after updating profile",res.data.updateuser)
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in upddate profile:", error);
            toast.error(error.response.data.message )
        }finally {
            set ({ IsUpdatingProfile : false});
        }
    },
    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            }
        });
        socket.connect();
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers: userIds});
        })
        set({socket:socket});
    },
    DisconnectSocket: ()=> {
        if(get().socket?.connected) get().socket.disconnect();
    }
}))
