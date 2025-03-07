import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatstore'
import ChatHeader from '../components/ChatHeader'
import MessageInput from '../components/MessageInput'
import MessageSkeleton from '../components/MessageSkeleton'
import { useAuthstore } from '../store/useAuthstore'
import { formatMessageTime } from '../lib/util'
export default function ChatContainer() {
  const {messages, getMessages, isMessageLoading, selectedUser, subcribeToMessages, UnsubscribeMessages} = useChatStore();
  const {authUser} = useAuthstore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);  
    subcribeToMessages();
    return ()=>{
      UnsubscribeMessages();
    }
    
  },[selectedUser._id, getMessages, subcribeToMessages, UnsubscribeMessages])

  useEffect(()=>{
    if(messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({behaviour: "smooth"});
    }
  },[messages])

  if(isMessageLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className='flex-1 overflow-y-auto' >
        {messages.map((message)=>(
          <div
            key= {message._id}
            ref={messageEndRef}
            className={`chat ${message.senderid === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img 
                  src={
                    message.senderid === authUser._id
                     ? authUser.profilepic || "/avatar.png"
                     : selectedUser.profilepic || "/avatar.png"
                  }
                  alt='profile pic'
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>
                  {(formatMessageTime(message.createdAt))}
                </time>
            </div>
            <div className='chat-bubble flex flex-col'>
                {message.image && (
                  <img 
                    src={message.image}
                    alt='Attachment'
                    className='sm:max-[200px] rounded-md mb-2'
                  />
                )}
               {message.message && <p>{message.message}</p>}
            </div>
          </div>
          ))}
      </div>

      <MessageInput />
    </div>

  )
}
