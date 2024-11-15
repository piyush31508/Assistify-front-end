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

    async function fetchResponse() {
       
        try {
            if(prompt === "")
                return;
            setNewRequestLoading(true);

            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAdDe9F6B-21MQ-RqbeEAZ7QrXuSKbtZXo`,
                method: "post",
                data: {
                    contents: [{ parts: [{ text: prompt }] }]
                }
            });

            setPrompt("");

            const message = {
                question: prompt,
                answer: response.data.candidates[0].content.parts[0].text
            }

            setMessages((prev)=>[...prev, message]);
            setNewRequestLoading(false);

            const { data } = await axios.post(`${server}/chat/${selected}`,{
                question: prompt,
                answer: response.data.candidates[0].content.parts[0].text
            },{
                headers:{
                    token: localStorage.getItem("token")
                }
            })
        } catch (error) {
            console.error(error);
            alert("Failed to generate response");
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
