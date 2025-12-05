import { useState, useEffect, useRef } from 'react';
import SideBar from '../component/SideBar';
import { Menu, X, Send, Copy, Check } from "lucide-react";
import Header from '../component/Header';
import { ChatData } from '../context/ChatContext';
import { CgProfile } from "react-icons/cg";
import { BsRobot } from "react-icons/bs";
import { LoadingSmall, LoadingBig } from "../component/Loading";
import toast from 'react-hot-toast';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const { fetchResponse, messages, prompt, setPrompt, newRequestLoading, loading, chats } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      fetchResponse();
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const messageContainerRef = useRef();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      <SideBar isOpen={isOpen} toggleSideBar={toggleSideBar} />

      <div className='flex flex-1 flex-col relative'>
        
        <button
          onClick={toggleSideBar}
          className="md:hidden fixed top-4 right-4 z-30 p-3 bg-gray-800/80 backdrop-blur-sm 
          hover:bg-gray-700 rounded-xl transition-all duration-200 border border-gray-700/50
          shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        
        <div className='flex-1 flex flex-col overflow-hidden'>
          <div className='p-6 md:p-8'>
            <Header />
          </div>

          <div 
            ref={messageContainerRef}
            className='flex-1 px-6 md:px-8 overflow-y-auto custom-scrollbar pb-32'
          >
            {loading ? (
              <LoadingBig />
            ) : messages && messages.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className="animate-fadeIn">
                    
                    <div className="flex justify-end mb-4">
                      <div className="max-w-[85%] md:max-w-[70%]">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-sm p-4 shadow-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-white text-blue-600 rounded-full p-2 h-9 w-9 flex items-center justify-center flex-shrink-0">
                              <CgProfile className="w-5 h-5" />
                            </div>
                            <p className="text-white pt-1 break-words">{msg.question}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[85%] md:max-w-[70%]">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl rounded-tl-sm p-4 shadow-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full p-2 h-9 w-9 flex items-center justify-center flex-shrink-0">
                              <BsRobot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-gray-100 whitespace-pre-wrap break-words">{msg.answer}</p>
                              <button
                                onClick={() => copyToClipboard(msg.answer, i)}
                                className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-blue-400 transition-colors duration-200"
                              >
                                {copiedIndex === i ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy response</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {newRequestLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4">
                      <LoadingSmall />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto text-center py-12">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                  <BsRobot className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-50" />
                  <p className="text-gray-400 text-lg">Start a conversation by typing a message below</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isOpen && chats && chats.length > 0 && (
          <div className='fixed bottom-0 right-0 left-0 md:left-80 p-4 md:p-6 
            bg-gradient-to-t from-black via-gray-900/95 to-transparent backdrop-blur-sm'>
            <div className="max-w-4xl mx-auto">
              <form onSubmit={submitHandler} className="relative">
                <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm 
                  border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden
                  focus-within:border-blue-500/50 transition-all duration-200">
                  <input
                    className='flex-1 p-4 md:p-5 bg-transparent text-white outline-none placeholder-gray-500'
                    type="text"
                    placeholder='Ask me anything...'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    disabled={newRequestLoading}
                  />
                  <button 
                    type="submit"
                    disabled={!prompt.trim() || newRequestLoading}
                    className="m-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-500 hover:to-purple-500 rounded-xl 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 group"
                  >
                    <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Powered by Meta Llama AI
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;