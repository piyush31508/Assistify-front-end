import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { LoadingSpinner } from '../component/Loading';
import { ChatData } from '../context/ChatContext';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { fetchChats } = ChatData();
  const { verifyUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const SubmitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchChats);
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4'>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className='relative w-full max-w-md animate-fadeIn'>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400">Enter the code we sent to your email</p>
        </div>

        <form
          className='bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl'
          onSubmit={SubmitHandler}
        >
          <div className='mb-6'>
            <label className='text-gray-300 block mb-2 font-medium' htmlFor='otp'>
              Verification Code
            </label>
            <input
              className='w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl 
              text-white text-center text-2xl tracking-widest outline-none 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 placeholder-gray-500'
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              type="number"
              id="otp"
              maxLength="6"
            />
          </div>

          <button
            type="submit"
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-500 hover:to-purple-500 text-white py-4 px-6 rounded-xl
            font-semibold transition-all duration-200 flex items-center justify-center gap-2
            shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
            disabled:opacity-50 disabled:cursor-not-allowed group'
            disabled={btnLoading}
          >
            {btnLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{' '}
              <button 
                type="button"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                onClick={() => window.location.href = '/login'}
              >
                Resend
              </button>
            </p>
          </div>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;