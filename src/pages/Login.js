import React from 'react'
import { useState } from 'react';
import { UserData } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../component/Loading';

const Login = () => {

  const [email, setEmail] = useState("");

  const { loginUser, btnLoading } = UserData();

  const navigate = useNavigate();

  const SubmitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <form
        className='rounded bg-white p-6 shadow-md w-full md:w-[500px]'
        onSubmit={SubmitHandler}>
        <h2 className='text-2xl mb-4'>Login</h2>
        <div className='mb-4'>
          <label className='text-gray-600 block mb-2' htmlFor='email'>Email:</label>
          <input
            className='border p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-500'
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder="Enter your email"
            type="email"
            id="email"
          />
        </div>
        <button
          className='bg-black text-white py-2 px-4 rounded hover:bg-slate-600'
          disabled={btnLoading}>
            {btnLoading ? <LoadingSpinner /> : "Submit"}
          </button>
      </form>
    </div>
  )
}

export default Login
