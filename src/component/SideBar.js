import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import toast from "react-hot-toast";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus, LogOut, Sparkles } from "lucide-react";

const SideBar = ({ isOpen, toggleSideBar }) => {
    const { Logout } = UserData();
    const { chats, createChat, createLod, setSelected, deleteChat, selected } = ChatData();
    
    const deleteChatHandler = async (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this chat?");
        if (userConfirmed) {
            try {
                await deleteChat(id);
            } catch (error) {
                console.error("Failed to delete chat:", error);
                toast.error("Failed to delete the chat. Please try again.");
            }
        }
    };

    const navigate = useNavigate();  
    const handleLogout = () => {
        Logout(navigate); 
    };

    const handleChatSelect = (chatId) => {
        setSelected(chatId);
        if (window.innerWidth < 768) { 
            toggleSideBar();
        }
    };

    return (
        <>
            
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSideBar}
                ></div>
            )}
            
            <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black 
                border-r border-gray-800/50 p-4 transition-transform duration-300 ease-in-out
                transform md:relative md:translate-x-0 md:w-80
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                
                <div className="mb-6 pb-4 border-b border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                            <div className="absolute inset-0 bg-blue-400 blur-lg opacity-50"></div>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Assistify
                        </h1>
                    </div>
                </div>

                
                <button 
                    onClick={async () => {
                        await createChat();
                        if (window.innerWidth < 768) toggleSideBar();
                        }}
                    disabled={createLod}
                    className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium
                    transition-all duration-200 flex items-center justify-center gap-2
                    shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                    disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {createLod ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                            <span>New Chat</span>
                        </>
                    )}
                </button>

                
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-400 font-medium">Recent Chats</p>
                    </div>
                    
                    <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {chats && chats.length > 0 ? (
                            chats.map((chat) => (
                                <div 
                                    key={chat._id}
                                    className={`group flex items-center gap-2 transition-all duration-200
                                        ${selected === chat._id 
                                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50' 
                                            : 'bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50'
                                        } border rounded-xl p-3 cursor-pointer`}
                                >
                                    <button
                                        onClick={() => handleChatSelect(chat._id)}
                                        className="flex-1 text-left overflow-hidden"
                                    >
                                        <span className="text-sm text-gray-200 line-clamp-2">
                                            {chat.latestMessage || "New conversation"}
                                        </span>
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteChatHandler(chat._id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 
                                        rounded-lg transition-all duration-200 text-gray-400 hover:text-red-400
                                        flex-shrink-0"
                                        title="Delete chat"
                                    >
                                        <MdDelete className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No chats yet</p>
                                <p className="text-xs mt-1 text-gray-600">Create a new chat to get started</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-800/50">
                    <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-3 bg-gray-800 hover:bg-red-600/20 border border-gray-700
                        hover:border-red-500/50 rounded-xl transition-all duration-200
                        flex items-center justify-center gap-2 text-gray-300 hover:text-red-400 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideBar;