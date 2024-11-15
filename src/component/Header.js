import React from 'react'
import { UserData } from '../context/UserContext';

const Header = () => {
    const {chats} = UserData();
  return (
    <div>
      <p className='text-lg mb-6'>Hello How can I help you?</p>
      {chats && chats.length === 0 && <p className='text-lg mb-6'>Create a new chat to continue</p>}
    </div>
  )
}

export default Header
