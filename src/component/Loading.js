export const LoadingSpinner = () => {
    return (
        <div className="inline-block w-5 h-5 border-2 border-t-2 border-r-transparent border-white rounded-full animate-spin"></div>
    );
};

export const LoadingBig = () => {
    return (
        <div className="flex space-x-2 justify-center items-center w-[200px] m-auto mt-[300px]">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce"></div>
        </div>
    );
};

export const LoadingSmall = () => {
    return (
        <div className="flex space-x-2 justify-center items-center p-4">
            <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-pink-400 rounded-full animate-bounce"></div>
        </div>
    );
};