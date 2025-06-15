import React,{useEffect} from 'react'
import { useChatStore } from '../store/useChatStore'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'
import { useRef } from 'react'


const ChatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore()
  const messageEndRef = useRef(null)


  useEffect(()=>{
    getMessages(selectedUser._id); 
    subscribeToMessages();

    return ()=> unsubscribeFromMessages();
  },[selectedUser._id,getMessages])

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])

  if(isMessagesLoading)  {
    return <div className='flex-1 flex flex-col overflow-auto'> 
      <ChatHeader/>
      <MessageSkeleton/>  
      <MessageInput />
    </div>
  }
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 border-b bg-white z-10">
        <ChatHeader />
      </div>
  
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {Array.isArray(messages) &&
          messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef} 
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble">
                {message.image && (
                  <img src={message.image} alt="sent" className="mt-2 max-w-xs rounded" />
                )}
                {message.text}
              </div>
            </div>
          ))}
      </div>
      <div className="shrink-0 border-t bg-white z-10">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer


