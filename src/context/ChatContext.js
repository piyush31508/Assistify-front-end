import { server } from '../index.js';
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
const ChatContext = createContext();
export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [newRequestLoading, setNewRequestLoading] = useState(false);

   // inside ChatProvider -- replace your fetchResponse with this:
async function fetchResponse() {
  try {
    if (!prompt || prompt.trim() === "") return;

    // capture current prompt before clearing state
    const currentPrompt = prompt;
    setNewRequestLoading(true);

    // OpenRouter API key - prefer env var, fallback to localStorage
    const OPENROUTER_API_KEY =
      process.env.REACT_APP_OPENROUTER_KEY || localStorage.getItem("OPENROUTER_KEY");

    if (!OPENROUTER_API_KEY) {
      setNewRequestLoading(false);
      toast.error("Missing OpenRouter API key. Set REACT_APP_OPENROUTER_KEY or save it to localStorage.");
      return;
    }

    // call OpenRouter chat/completions endpoint with a system prompt to prefer plain text
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Respond in plain text only. Do NOT use bullet points, '*', '-', '+', Markdown, or formatting. Use plain sentences only."
          },
          { role: "user", content: currentPrompt }
        ],
        // you can optionally set other params like temperature/max_tokens here
        // temperature: 0.2,
        // max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    
    setPrompt("");

    // defensive parsing of the model response
    const choice = response?.data?.choices?.[0];
    let answerText = "";

    if (choice) {
      if (choice.message) {
        if (typeof choice.message.content === "string") {
          answerText = choice.message.content;
        } else if (Array.isArray(choice.message.content)) {
          const first = choice.message.content[0];
          answerText = first?.text ?? JSON.stringify(choice.message.content);
        } else if (typeof choice.message.content === "object") {
          answerText = choice.message.content?.parts?.[0] ?? JSON.stringify(choice.message.content);
        }
      }

      if (!answerText) {
        answerText = choice.text || choice.delta?.content || "";
      }
    }

    if (!answerText) {
      answerText = response?.data?.choices?.[0]?.message?.content || "";
    }

    // === CLEANING: remove common markdown/bullet characters and extra whitespace ===
    if (answerText && typeof answerText === "string") {
      // remove backticks (inline code / code blocks)
      answerText = answerText.replace(/`+/g, "");

      // remove markdown headings like ##, ### at start of lines
      answerText = answerText.replace(/^\s{0,3}#{1,6}\s*/gm, "");

      // remove unordered list markers at line starts: -, *, +
      answerText = answerText.replace(/^\s*[-*+]\s+/gm, "");

      // remove ordered list numbers like "1. " at line starts
      answerText = answerText.replace(/^\s*\d+\.\s+/gm, "");

      // remove any stray asterisks anywhere
      answerText = answerText.replace(/\*/g, "");

      // collapse multiple blank lines into single newline
      answerText = answerText.replace(/\n{2,}/g, "\n\n");

      
      answerText = answerText.trim();
    }

    const message = {
      question: currentPrompt,
      answer: answerText || "No answer returned from model"
    };

    
    setMessages((prev) => [...prev, message]);
    setNewRequestLoading(false);

   
    try {
      await axios.post(
        `${server}/chat/${selected}`,
        {
          question: currentPrompt,
          answer: message.answer
        },
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );
    } catch (saveErr) {
      console.warn("Failed to save chat to server:", saveErr);
    }
  } catch (error) {
    console.error("OpenRouter error:", error);
    toast.error("Failed to generate response");
    setNewRequestLoading(false);
  }
}

    const [chats,setChats] = useState([]);

    const [selected, setSelected] =useState(null);

    async function fetchChats(){
        try {
            const { data } = await axios.get(`${server}/chat/all`, {
                headers:{
                    token: localStorage.getItem("token")
                },
            })
            setChats(data);
            setSelected(data[0]._id);
        } catch (error) {
            console.log(error);
        }
    }

    const [createLod, setCreateLod] = useState(false);
    async function createChat() {
        setCreateLod(true);
        try {
            
            const { data } = await axios.post(`${server}/chat/new`,{}, {
                headers:{
                    token: localStorage.getItem("token"),
                },
            });

            fetchChats();
            setCreateLod(false);
            toast.success("New chat created successfully");
        } catch (error) {
            console.log(error);
            setCreateLod(false);
            toast.error("Something went wrong with the creation of a new chat");
        }
    }

    const [loading, setLoading] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        if (!selected) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${server}/chat/${selected}`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            if (data.message === "No conversation found") {
                setMessages([]); 
            } else {
                setMessages(data);
            }
        } catch (error) {
            console.error(error);  
            if (error.response?.data?.message !== "No conversation found") {
                toast.error("Something went wrong with fetching messages");
            }
        } finally {
            setLoading(false);
        }   
    };

    async function deleteChat(id){
        try {
            const { data } = await axios.delete(`${server}/chat/${id}`,{
                headers:{
                    token: localStorage.getItem("token"),
                },
            });
            toast.success(data.message);
            fetchChats();
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Unsuccessful deletion")
        }
    }

    useEffect(()=> {
        fetchChats();
    },[])


    useEffect(() => {
        if (selected !== null) {
            fetchMessages();
        }
    }, [selected]);

    return (
        <ChatContext.Provider value={{
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
            setLoading,
            deleteChat,
            fetchChats
            }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatData = () => useContext(ChatContext);
