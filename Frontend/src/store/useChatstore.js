import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance} from "../lib/axios"
import { useAuthstore } from "./useAuthstore";


export const useChatStore = create((set,get) => ({
    messages :[],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers: async() => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },

    getMessages: async(userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        console.log("userId", userId);
        console.log("gettingmessages",res.data);
        set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading : false });
        }
    },

    sendMessage: async(messageData) => {
    const { selectedUser, messages } = get();
    console.log(messages);
    try{
      const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
      console.log("rrsponse data",res.data.sendermessage);
      set({messages: [...messages,res.data.sendermessage]});
    }catch(error){
      toast.error(error.response.data.message);
    }
    } ,

    subcribeToMessages : ()=>{
      const {selectedUser} = get();
      if(!selectedUser) return;

      const socket = useAuthstore.getState().socket;
      socket.on("newMessage",(sendermessage)=>{
        const isMessageSentFromUser = sendermessage.senderid === selectedUser._id;
        if(!isMessageSentFromUser) return;
        console.log("sendermessageusechatstorefile", sendermessage);
        set({
          messages: [...get().messages, sendermessage]
        });
      });
    },

    UnsubscribeMessages: ()=>{
      const socket = useAuthstore.getState().socket;
      socket.off("newMessage");
    },
    // optimize this one later 
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))