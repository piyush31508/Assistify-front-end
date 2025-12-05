import React, { useState } from 'react';
import { UserData } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../component/Loading';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const { loginUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const SubmitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
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
              <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50"></div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Assistify
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Your AI-Powered Assistant</p>
        </div>

       
        <form
          className='bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl'
          onSubmit={SubmitHandler}
        >
          <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back</h2>
          <p className="text-gray-400 mb-6">Sign in to continue your AI journey</p>
          
          <div className='mb-6'>
            <label className='text-gray-300 block mb-2 font-medium flex items-center gap-2' htmlFor='email'>
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              className='w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl 
              text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 placeholder-gray-500'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              id="email"
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
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-6">
            We'll send you a verification code to your email
          </p>
        </form>

       
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Powered by Meta Llama AI</p>
        </div>
      </div>
    </div>
  );
};

export default Login;