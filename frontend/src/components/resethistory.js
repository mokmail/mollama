import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import {Box} from '@mui/material';
import Fab from '@mui/material/Fab';
import { useCookies } from 'react-cookie';
import TrashIcon from './trash';


const ResetHistory = ({hist}) => {
    
    const [cookies, setCookie, removeCookie] = useCookies(['history']);

    
    
   
    
    const handleClick = () => {
        fetch('http://localhost:5000/clear' , {
            method: 'GET',
       
        }).then((response) => response.json())
            .then((result) => {
                console.log( result.message)
                //setHistory(result.message)
                removeCookie('history')
                removeCookie('chatHistory')
                window.location.reload()
            })

            .catch((error) => console.error('Error resetting history:', error));
    };
    
    useEffect(() => {
        console.log('history:', hist);
    }
    , [hist]);



    return (
    <div className={`relative h-auto bg-gray-100 ${hist ? 'flex' : 'hidden' }`}>


      
      
   
    
     {
        <div className={` fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${hist ? 'flex' : 'hidden'}  flex-row   `}
            variant='outlined'
            color='error'
            
       
            
            onClick={handleClick}>
                
            <TrashIcon size={50} color={'white'} />
            
                </div> 
            
        
            
        }


   
       
    </div>
    
        
    );
    }

export default ResetHistory;