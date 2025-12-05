import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../index.js';
import { Toaster } from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [ loading, setLoading ] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    async function loginUser(email, navigate){
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/user/login`, {email});
            toast.success(data.message);
            localStorage.setItem('verifyToken', data.verifyToken);
            navigate('/verify');
            setBtnLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }

    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);

    async function verifyUser(otp, navigate, fetchChats){
  const verifyToken = localStorage.getItem('verifyToken');
  setBtnLoading(true);

  if (!verifyToken) {
    toast.error('No verification token found');
    setBtnLoading(false);   
    return;
  }

  try {
    const { data } = await axios.post(`${server}/user/verify`, { verifyToken, otp });
    toast.success(data.message);
    localStorage.clear();
    localStorage.setItem('token', data.token);
    navigate('/');
    setBtnLoading(false);
    setIsAuth(true);
    setUser(data.user);
    fetchChats();
  } catch (error) {
    toast.error(error.response?.data?.message || "Verification failed");
    setBtnLoading(false);
  }
}


    async function fetchUser() {
  const token = localStorage.getItem('token');

  if (!token) {
    setIsAuth(false);
    setLoading(false);
    return;
  }

  try {
    const { data } = await axios.get(`${server}/user/me`, {
      headers: { token },
    });
    setIsAuth(true);
    setUser(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
    setIsAuth(false);
    setLoading(false);

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      toast.error("Session expired. Please log in again.");
    }
  }
}

    
    const Logout = (navigate) => {
        toast.success("Logged Out Successfully");
        localStorage.removeItem('token');
        setIsAuth(false);
        setUser([]);
        navigate('/login');
    }
    useEffect(() => {

            fetchUser();
        }, []);
    
    return (
        <UserContext.Provider value={{ loginUser, btnLoading, isAuth, setIsAuth, user, verifyUser, loading, Logout }}>
            {children}
            <Toaster position="top-right" reverseOrder={false} />

        </UserContext.Provider>
    )
}

export const UserData = () => useContext(UserContext);