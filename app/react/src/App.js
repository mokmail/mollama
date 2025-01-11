import React from 'react';
import ChatWithModel from './components/chat';
import ResetHistory from './components/resethistory';

import Header from './components/header';
import ChatWithModelUpdate from './components/chatupdate';


const App = () => {
    return (
        <div className='flex flex-col justify-center items-center w-11/12 mx-auto  p-12 h-full bg-slate-50'>
        <Header />
       

        {/* <ChatWithModel /> */}
        <ChatWithModelUpdate />
       
        
       
        </div>
    )
};

export default App;
