import { useState, useEffect, useRef } from 'react';
import SideBar from '../component/SideBar'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseCircleSharp } from "react-icons/io5";
import Header from '../component/Header';
import { ChatData } from '../context/ChatContext';
import { CgProfile } from "react-icons/cg";
import { BsRobot } from "react-icons/bs";
import { LoadingSmall, LoadingBig } from "../component/Loading";
import { IoMdSend } from "react-icons/io";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const { fetchResponse, messages, prompt, setPrompt, newRequestLoading, loading, chats } = ChatData();


  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  }

  const messageContainerRef = useRef();

  useEffect(()=>{
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  },[messages])
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SideBar isOpen={isOpen} toggleSideBar={toggleSideBar}/>

      <div className='flex flex-1 flex-col'>
        <button
          onClick={toggleSideBar}
          className="md:hidden p-4 bg-gray-800 text-2xl fixed top-4 right-4">
          {isOpen ? <IoCloseCircleSharp /> : <GiHamburgerMenu />}
        </button>

        <div className='flex-1 p-6 mb-20 md:mb-0'>
          <Header />
          {
            loading? <LoadingBig /> : <div className='flex-1 p-6 max-h-[600px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar'
            ref={messageContainerRef}>
              {
                messages && messages.length > 0 ? messages.map((e, i) => {
                  return (
                    <div key={i}>
                      <div className="mb-4 p-4 rounded bg-blue-700 text-white flex gap-1">
                        <div className="bg-white text-black text-2xl rounded-full p-2 h-10">
                          <CgProfile />
                        </div>
                        {e.question}
                      </div>
  
                      <div className="mb-4 p-4 rounded bg-gray-700 text-white flex gap-1">
                        <div className="bg-white text-black text-2xl rounded-full p-2 h-10">
                          <BsRobot />
                        </div>
                        {e.answer}
                      </div>
  
  
                    </div>
                  )
                }) : <p>No Chat Yet</p>
              }
  
              {newRequestLoading && <LoadingSmall />}
            </div>
          }
        </div>
      </div>

      { 
  !isOpen && chats && chats.length === 0 ? null : 
  !isOpen && (
    <div className='fixed bottom-0 right-0 left-auto p-4 w-full md:w-3/4'>
      <form onClick={submitHandler} className="flex justify-center items-center">
        <input
          className='flex-grow p-4 bg-gray-500 rounded-l text-white outline-none'
          type="text"
          placeholder='Enter a prompt here'
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
        <button className="p-4 bg-gray-600 rounded-r text-2xl text-white">
          <IoMdSend />
        </button>
      </form>
    </div>
  )
}

    </div>
  )
}

export default Home
