import React from 'react';
import { ChatData } from '../context/ChatContext';
import { Sparkles, MessageSquarePlus } from 'lucide-react';

const Header = () => {
    const { chats } = ChatData(); 
    
    return (
        <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                    <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50"></div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Assistify AI
                </h1>
            </div>
            
            {chats && chats.length === 0 ? (
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <MessageSquarePlus className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-gray-200">Get Started</h2>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Create your first chat to unlock the power of AI assistance
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['Ask Questions', 'Get Insights', 'Solve Problems', 'Learn More'].map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 text-lg">
                    What can I help you with today?
                </p>
            )}
        </div>
    );
};

export default Header;