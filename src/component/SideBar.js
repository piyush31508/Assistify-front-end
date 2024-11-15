import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import toast from "react-hot-toast";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SideBar = ({ isOpen, toggleSideBar }) => {
    const { Logout } = UserData();
    const { chats, createChat, createLod, setSelected, deleteChat } = ChatData();
    const deleteChatHandler = (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this chat?");
        if (userConfirmed) {
            try {
                deleteChat(id);
                toast.success("Chat deleted successfully");
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

    return (
        <div className={`text-white fixed inset-0 bg-gray-800 p-2 transition-transform
            transform md:relative md:translate-x-0 md:w-1/4 md:block
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            <div className="text-2xl font-semibold mb-6">
                Assistify
            </div>
            <div className="mb-4">
                <button 
                    onClick={createChat}
                    className="w-full px-2 mt-[25px] py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                    {createLod ? <LoadingSpinner /> : "New Chat +"}
                </button>
            </div>

            <div>
                <p className="text-md text-gray-400 mb-2">Recent Chats</p>
                <div className="max-h-[500px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar">
                    {chats && chats.length > 0 ? (
                        chats.map((e) => (
                            <div className="flex" key={e._id}>
                                <button
                                    onClick={() => {
                                        setSelected(e._id)
                                        toggleSideBar();
                                    }}
                                    className="w-full text-left py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded mt-2 flex justify-between items-center"
                                >
                                    <span>{e.latestMessage.slice(0, 35)}...</span>
                                </button>
                                <div
                                    onClick={(event) => {
                                        event.stopPropagation(e._id); 
                                        deleteChatHandler(e._id);
                                    }}
                                    className="px-2 py-2 bg-black hover:bg-gray-400 hover:text-black rounded mt-2 flex justify-center items-center cursor-pointer"
                                >
                                    <MdDelete />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Chat Yet</p>
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 mb-6 w-full">
                <button className="px-2 py-2 bg-black hover:bg-gray-500 hover:text-black rounded text-xl
                    mt-2 flex justify-center items-center"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SideBar;
