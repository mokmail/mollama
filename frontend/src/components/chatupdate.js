import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import MarkdownRenderer from './markdown';
import SyncLoader from 'react-spinners/SyncLoader';
import ResetHistory from './resethistory';
import { useCookies } from 'react-cookie';
import {Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatWithModelUpdate = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cookies, setCookie] = useCookies(['chatHistory', 'history' , 'loading']);
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        // Load chat history from cookies when component mounts
        try {
            const savedHistory = cookies.chatHistory ? cookies.chatHistory : [];
            setChatHistory(savedHistory);
        } catch (error) {
            console.error('Error parsing chatHistory from cookies:', error);
            setChatHistory([]);
        }
    }, []);

    useEffect(() => {
        // Save chat history to cookies whenever it updates
        setCookie('history' , true) 
        setCookie('chatHistory', JSON.stringify(chatHistory), { path: '/' });
    }, [chatHistory, setCookie]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!question.trim()) return;

        setResponse(''); // Clear previous response
        setIsLoading(true);
        const newChatEntry = { type: 'question', text: question };

        // Update local chat history
        setChatHistory((prev) => [...prev, newChatEntry, { type: 'response', text: '' }]);

        try {
            const payload = { question };
            const res = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.body) {
                throw new Error('No response body from server.');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let fullResponse = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;

                // Update the last response in chat history dynamically
                setChatHistory((prev) => {
                    const updatedHistory = [...prev];
                    const lastIndex = updatedHistory.length - 1;
                    if (updatedHistory[lastIndex].type === 'response') {
                        updatedHistory[lastIndex].text = fullResponse;
                    }
                    return updatedHistory;
                });
            }

            // Ensure the final response is saved
            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                const lastIndex = updatedHistory.length - 1;
                if (updatedHistory[lastIndex].type === 'response') {
                    updatedHistory[lastIndex].text = fullResponse;
                }
                return updatedHistory;
            });
        } catch (error) {
            console.error('Error receiving streamed data:', error);
            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                const lastIndex = updatedHistory.length - 1;
                if (updatedHistory[lastIndex].type === 'response') {
                    updatedHistory[lastIndex].text = 'Error communicating with the server.';
                }
                return updatedHistory;
            });
        } finally {
            setIsLoading(false);
        }

        setQuestion(''); // Clear input field
    };

    const clearHistory = () => {
        setChatHistory([]);
        setCookie('chatHistory', JSON.stringify([]), { path: '/' });
    };

    return (
        <div className="flex flex-col justify-center items-center h-full w-full p-4">
          

            <div id="chat-history" className="w-9/12 bg-gray-50 p-4 rounded-lg   m-auto  ">
                {chatHistory.map((entry, index) => (
                    <div
                        key={index}
                        className={` break-all w-fit p-4 m-auto my-2 rounded-xl hover:shadow-2xl  hover:p-5 duration-300 ${entry.type === 'question' ? 'bg-blue-100 text-left rounded-tl-none ml-0  ' : 'bg-slate-100 text-left items-end mr-0 justify-end  rounded-tr-none '}`}
                    >
                        <div className='text-wrap'>
                        <MarkdownRenderer markdownText= {entry.text} /> </  div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="w-9/12 mt-4">
        { isLoading ?
        <div className="flex items-center justify-center m-auto w-full">
                            <SyncLoader color="#2196F3" size={10} />
                        </div>:
        <div className='flex flex-col gap-5'>
               

<Box display="flex" gap={2} className="h-24" alignItems="center"  >
      <TextField
      className='h-auto'
        label="What’s on Your Mind?"
        variant="filled"
        multiline
        rows={3}
        fullWidth
        value={question}
        placeholder='Type your question here'
        onChange={(e) => setQuestion(e.target.value)}

      />
      <Button 
        variant="outlined"
        className='h-24 w-48 m-2' 
        color="primary" 
        
        type='submit'
         disabled={isLoading}
      >
        <SendIcon />
      </Button>
    </Box>

                    </div>

                    
                    
                
                    }
                    <ResetHistory hist={cookies.history} />
                
            </form>
        </div>
    );
};

export default ChatWithModelUpdate;
