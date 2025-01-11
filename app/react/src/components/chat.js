import React, { use, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { TextField } from '@mui/material';
import MarkdownRenderer from './markdown';
import ClipLoader from "react-spinners/ClipLoader";
import RingLoader from "react-spinners/RingLoader";
import RiseLoader from 'react-spinners/RiseLoader';
import CircleLoader from 'react-spinners/CircleLoader';
import SyncLoader from 'react-spinners/SyncLoader';
import ResetHistory from './resethistory';
import {useCookies} from 'react-cookie';
const ChatWithModel = () => {
    const [question, setQuestion] = useState('');
    const [language, setLanguage] = useState('english');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['history' , 'loading']);
   
    const [verlaufs, setVerlaufs] = useState([{
        "typ": "",
        "text": "" 
    
    }]);

    
    const handleSubmit = async (event) => {
        setCookie('loading', false)
       


        

        event.preventDefault(); // Prevent default form submission

        setResponse(''); // Clear previous response
        setIsLoading(true);
        setVerlaufs([...verlaufs , {"typ": "question"} , {"text": question}])
       
        //drawVerlauf(verlaufs)
        setQuestion('') // Set loading state
        

        try {
            const payload = {
                question,
                language,
            
                
            };
            

            console.log('Sending payload:', payload);

            const res = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
                
            });

            if (!res.body) {
                throw new Error('No response body from server.');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
        
            setCookie('loading', true)
            while (true) {
                const { done, value } = await reader.read();
                if (done) {break;
                    
                 } // Stop reading when done
                const chunk = decoder.decode(value);
                setCookie('history', true)
                
                setResponse((prev) => prev + chunk);


            }
            //setVerlaufs([...verlaufs , {"typ": "response"} , {"text":response}])
            
            
            //drawVerlauf(verlaufs)
            
           
            
           
        } catch (error) {
            console.error('Error receiving streamed data:', error);
            setResponse('Error communicating with the server.');
        } finally {
            setIsLoading(false); // Reset loading state
            
            
        }
    };
    

    function drawVerlauf(items) {
      
           
        
        // const item = verlaufs[items.length - 1]
        // console.log("items: ", items)


        // const textdiv = document.createElement('p');
        // const typdiv = document.createElement('div');
        

        // typdiv.className = 'text-left p-2 bg-gray-200 rounded-lg m-2';
        // typdiv.innerHTML = item["typ"]
        // textdiv.className = 'text-left p-2 bg-gray-200 rounded-lg m-2 w-full';
        // textdiv.innerHTML =response;
        

        // var verlauf = document.getElementById('verlauf');
        // typdiv.innerHTML = "entry"
        // verlauf.appendChild(typdiv);
        // verlauf.innerHTML = response;

        
        // verlauf.appendChild(textdiv);

        
        // //verlauf.appendChild(textdiv);
    
  
    }

useEffect(() => {
    
 drawVerlauf(verlaufs)
  
        console.log('ChatWithModel mounted.');
}
, [cookies.history , cookies.loading  , response ] );


    return (
        <div className="flex flex-col justify-center items-center h-full w-full   p-4">
            
            <div className="text-xl font-bold">Local Chat</div>

<div id='verlauf'>
   
    </div> 


      { cookies.loading && 
            

            <div className="mt-6 w-9/12">
                 
            
                <h2 className="text-lg font-semibold">Here’s What I Found:</h2>
                <div
                    className="bg-gray-50 p-4 rounded-lg  mt-2 border-t   w-full"
                    
                >
                    {/* {response || (isLoading ? 'Loading...' : 'No response yet.')} */}
                    

                    {response && <MarkdownRenderer markdownText={response} />  }
                
                </div>
                

                    
   
            </div>}
            <ResetHistory hist={cookies.history} />
                           
          

            <form onSubmit={handleSubmit} className="w-9/12 p-5 mt-4">
            
                {
                    isLoading ? <div className='flex items-center justify-center m-auto w-full '><SyncLoader color='#2196F3' /></div>  :
                
                <TextField
                    id="question"
                    required
                    name="question"
                    label="What’s on Your Mind?"
                    rows="4"
                    multiline

                    variant="outlined"
                    color='error'
                    
                    className="w-full p-2 border rounded"
                    placeholder="Your next great idea starts here. What’s on your mind?"
                    margin="normal"
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />}


                {/* <label htmlFor="language" className="block mt-4 mb-2 font-medium">Language:</label>
                <select
                    name="language"
                    id="language"
                    className="w-full p-2 border rounded"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="english">English</option>
                    <option value="german">German</option>
                    <option value="arabic">Arabic</option>
                </select> */}
                <div className='p-1  w-1/2 m-auto flex flex-row justify-center items-center'>
                   
                   {
                    isLoading ?  "":    <Button
                    type="submit"
                    variant="contained"
                    color='primary'
                    className='w-full h-12'
              
                   
                    disabled={isLoading}
                >
                     Let’s Go!
                </Button>
                   }
                
                </div>
                
            </form>
           
          
        </div>
    );
};

export default ChatWithModel;
