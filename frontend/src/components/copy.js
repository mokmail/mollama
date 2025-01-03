import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';

const CopyButton = ({text}) => {
  const [copiedText, setCopiedText] = useState(null);
  const [textToCopy, setTextToCopy] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => {
      setCopiedText(false);
    }, 2000);
  };

  return (
    <div>
      <Button color='primary' className='float-right' onClick={
    () =>{ 
    handleCopy()
    } }><ContentCopyIcon fontSize='small'/></Button>
       
      {copiedText && <p className='flex relative top-0 text-slate-50 rounded right-2 bg-slate-500/[.5] border float-right p-1 ' >Copied!</p>}
   
    </div>
  );
};

export default CopyButton;