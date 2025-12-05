import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../index.js";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);

  const [createLod, setCreateLod] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResponse = async () => {
    try {
      if (!prompt.trim()) return;

      const currentPrompt = prompt;
      setPrompt("");
      setNewRequestLoading(true);

      if (!selected) {
        toast.error("Please select a chat");
        setNewRequestLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${server}/chat/${selected}`,
        { question: currentPrompt },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      const answer = data?.conversation?.answer || "No answer returned";

      const message = {
        question: currentPrompt,
        answer,
      };

      setMessages((prev) => [...prev, message]);
      
      // Update chat list to reflect latest message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === selected 
            ? { ...chat, latestMessage: currentPrompt }
            : chat
        )
      );
      
      setNewRequestLoading(false);
    } catch (error) {
      console.error("Backend error:", error);
      toast.error(error.response?.data?.message || "Failed to generate response");
      setNewRequestLoading(false);
    }
  };


  async function fetchChats() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const { data } = await axios.get(`${server}/chat/all`, {
      headers: { token },
    });

    setChats(data);

    if (data.length > 0 && !selected) {
      setSelected(data[0]._id);
    }
  } catch (error) {
    console.error("Error fetching chats:", error);

    // If token is invalid/expired, let fetchUser handle the toast
    if (error.response?.status === 401) {
      return;
    }

    toast.error("Failed to load chats");
  }
}


  async function createChat() {
    setCreateLod(true);
    try {
      const { data } = await axios.post(
        `${server}/chat/new`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );

      // Add the new chat and select it
      const newChat = data.chat || data;
      setChats(prev => [newChat, ...prev]);
      setSelected(newChat._id);
      setMessages([]); // Clear messages for new chat
      setCreateLod(false);
      toast.success("New chat created");
    } catch (error) {
      console.error("Error creating chat:", error);
      setCreateLod(false);
      toast.error("Failed to create chat");
    }
  }

  const fetchMessages = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/chat/${selected}`, {
        headers: { token: localStorage.getItem("token") },
      });

      if (data.message === "No conversation found" || !data || data.length === 0) {
        setMessages([]);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (error.response?.status === 404 || error.response?.data?.message === "No conversation found") {
        setMessages([]);
      } else {
        toast.error("Failed to load messages");
      }
    } finally {
      setLoading(false);
    }
  };


  async function deleteChat(id) {
    try {
      await axios.delete(`${server}/chat/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });

      // Remove chat from state
      const updatedChats = chats.filter(chat => chat._id !== id);
      setChats(updatedChats);

      // If deleted chat was selected, clear messages and select another chat
      if (selected === id) {
        setMessages([]);
        if (updatedChats.length > 0) {
          setSelected(updatedChats[0]._id);
        } else {
          setSelected(null);
        }
      }

      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selected !== null) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        deleteChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);