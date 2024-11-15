import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { LoadingSpinner } from '../component/Loading';
import { ChatData } from '../context/ChatContext';

const Verify = () => {
  const [otp, setOtp] = useState("");

  const { fetchChats } = ChatData();
  const { verifyUser, btnLoading } = UserData();

  const navigate = useNavigate();

  const SubmitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchChats);
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <form
        className='rounded bg-white p-6 shadow-md w-full md:w-[500px]'
        onSubmit={SubmitHandler}>
        <h2 className='text-2xl mb-4'>Verify</h2>
        <div className='mb-4'>
          <label className='text-gray-600 block mb-2' htmlFor='otp'>OTP:</label>
          <input
            className='border p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-500'
            required
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value)
            }}
            placeholder="Enter OTP"
            type="number"
            id="otp"
          />
        </div>
        <button className='bg-black text-white py-2 px-4 rounded hover:bg-slate-600'>
        {btnLoading ? <LoadingSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default Verify;
