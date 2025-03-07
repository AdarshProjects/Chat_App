import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatstore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessageInput() {
  const [text, setText] =  useState("");
  const [ImagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const {sendMessage} = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    console.log("reader",reader)
    reader.onloadend = () => {
      console.log("result",reader.result);
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);
    console.log(ImagePreview);
  };

  useEffect(() => {
    console.log("Updated ImagePreview:", ImagePreview);
  }, [ImagePreview]);

  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessages = async(e) => {
    e.preventDefault();
    if(!text.trim() && !ImagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: ImagePreview,
      });

      //clear form
      setText("");
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  };

  return (
    <div className='p-4 w-full'>
      {ImagePreview && ( 
        <div className='mb-3 flex items-center gap-2'> 
          <div className='relative'>
            <img 
              src={ImagePreview}
              alt="Preview"
              className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
            />
            <button
              onClick={removeImage}
              className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center'
              type='button'
            >
              <X className='size-3' />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessages} className='flex items-center gap-2'>
          <div className='flex-1 flex gap-2'>
          <input
            type='text'
            className='w-full input input-bordered rounded-lginput-sm sm:input-md'
            placeholder='Type a message...'
            onChange={(e)=> setText(e.target.value)}
          />
          <input
            type="file"
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type='button'
            className={`hidden sm:flex btn btn-circle 
              ${ImagePreview ? "text-emerald-500": "text-zinc-400"}`}
            onClick={()=> fileInputRef.current?.click()}
          >
            <Image size={20} />                   
          </button>
          </div>
          <button
            className='btn btn-sm btn-circle'
            disabled={!text.trim() && !ImagePreview}
            type='submit'
          >
            <Send size={22} />
          </button>
      </form>
    </div>
  )
}
