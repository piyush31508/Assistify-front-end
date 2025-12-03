import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  // =========================================================
  // 🔥 FETCH RESPONSE (now talks to BACKEND Only)
  // =========================================================
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

      // Call BACKEND instead of OpenRouter directly
      const { data } = await axios.post(
        `${server}/chat/${selected}`,
        { question: currentPrompt }, // ❗only question — backend generates answer
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
      setNewRequestLoading(false);
    } catch (error) {
      console.error("Backend error:", error);
      toast.error("Failed to generate response");
      setNewRequestLoading(false);
    }
  };

  // =========================================================
  // 🔥 FETCH ALL CHATS
  // =========================================================
  async function fetchChats() {
    try {
      const { data } = await axios.get(`${server}/chat/all`, {
        headers: { token: localStorage.getItem("token") },
      });

      setChats(data);

      if (data.length > 0) {
        setSelected(data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // =========================================================
  // 🔥 CREATE NEW CHAT
  // =========================================================
  async function createChat() {
    setCreateLod(true);
    try {
      await axios.post(
        `${server}/chat/new`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );

      await fetchChats();
      setCreateLod(false);
      toast.success("New chat created");
    } catch (error) {
      console.log(error);
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

      if (data.message === "No conversation found") {
        setMessages([]);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message !== "No conversation found") {
        toast.error("Something went wrong while fetching messages");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🔥 DELETE CHAT
  // =========================================================
  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`${server}/chat/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });

      toast.success(data.message);
      await fetchChats();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Failed to delete chat");
    }
  }

  // =========================================================
  // RUN ON START
  // =========================================================
  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selected !== null) {
      fetchMessages();
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
