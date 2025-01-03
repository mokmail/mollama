import React, { useState } from 'react';

const  Tutorial = () => {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleReset = () => {
    setStep(1);
    setMessage('');
  };

  const steps = [
    {
      title: 'Run the Installation Script',
      content:
        'Navigate to the project directory and execute the following command: <code>./star.sh</code>',
      nextButtonLabel: 'Next',
    },
    {
      title: 'Wait for Container Startup',
      content: 'As the script runs, wait for all the containers to start successfully.',
      nextButtonLabel: 'Next',
    },
    {
      title: 'Initialize OLLAMA Model',
      content:
        'Once all containers are up and running, the OLLAMA container will pull the llama3 model and run it within the OLLAMA Docker container.',
      nextButtonLabel: 'Next',
    },
    {
      title: 'Access Local Chat API',
      content: 'Open your web browser and navigate to <code>http://localhost:3000</code>',
      nextButtonLabel: 'Start Chatting!',
      resetButtonLabel: 'Reset',
    },
  ];

  return (
    <div className="tutorial flex flex-col justify-center items-center w-9/12 mx-auto my-12 p-12 h-full bg-slate-200">
      {steps[step - 1].title && (
        <h2>{steps[step - 1].title}</h2>
      )}
      {steps[step - 1].content && (
        <p>{steps[step - 1].content}</p>
      )}
      {(step > 1 || step === 4) && (
        <button onClick={handleNext}>
          {steps[step - 1].nextButtonLabel}
        </button>
      )}
      {step === 4 && (
        <button onClick={handleReset}>
          {steps[3].resetButtonLabel}
        </button>
      )}
    </div>
  );
};

export default  Tutorial;