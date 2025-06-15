import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null, 

    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get('/auth/check');
            console.log(res.data); 
            set({authUser: res.data})
            get().connectSocket()
        }
        catch(err){
            console.log('Error in checkAuth: ',err)
            set({authUser: null})
        }
        finally{
            set({isCheckingAuth: false})
        }
    },
    signup: async (data)=>{
        set({isSigningUp: true})
        try{
            console.log(data);
            const res = await axiosInstance.post('/auth/signup',data);
            console.log(res.data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket()
        }
        catch(err){
            toast.error(err?.response?.data?.message || 'Error while signing up');
        } 
        finally{
            set({isSigningUp: false})
        }
    },
    logout: async ()=>{
        try{
            const res = await axiosInstance.post('/auth/logout');
            set({authUser: null}) 
            toast.success('Logged out successfully')  
            get().disconnectSocket()  
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    },
    login: async (data)=>{
        try{
            const res = await axiosInstance.post('/auth/login',data);
            set({authUser: res.data})
            toast.success('Logged in successfully')
            get().connectSocket()
        }
        catch(err){
            console.log(err);
            toast.error(err.response.data.msg)
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile: true})
        try{
            const res = await axiosInstance.put('/auth/update-profile',data)
            set({authUser: res.data})
            toast.success('profile upadated successfully')
        }
        catch(err){
            console.log('Error while updating profile:',err)
            toast.error(err.response.data.mes)
        }
        finally{
            set({isUpdatingProfile: false})
        }
    },
    connectSocket: () => { 
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query: {
                userId: authUser._id    
            }
        });
        socket.connect();  

        set({socket: socket})   

        socket.on("getOnlineUsers",(userIds)=>{
            console.log({userIds});
            set({onlineUsers: userIds})
        })


    },
    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
}));