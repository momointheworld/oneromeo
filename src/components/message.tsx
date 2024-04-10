'use client';
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface actionProps {
    actions: () => Promise<FormData>; // Function to initialize form state
    formStateMessage: string; // Initial message to display
}

export default function DisplayMessage({actions, formStateMessage}: actionProps) {
    const [messageVisible, setMessageVisible] = useState(false);  
    const [message, setMessage] = useState(''); 
    // const [formState, action] = useFormState(actions, {message: ''} );

    // Effect to handle message visibility and close button visibility
    useEffect(() => {
        if (formStateMessage) {
            setMessage(formStateMessage);  
            setMessageVisible(true);  
        } else {
            setMessage('');  
            setMessageVisible(false);  
        }
    }, [formStateMessage]);


    // Function to handle closing the message
    const closeMessage = () => {
        setMessage('');  
        setMessageVisible(false);  
    }

    return(
        <>
        {messageVisible && (
            <div className='bg-red-200 text-gray-700 px-5 rounded flex flex-row justify-between'>
             <p className='self-center'> {formStateMessage} </p>
                <button 
                    className="font-bold hover:text-gray-700"
                    onClick={closeMessage}
                >
                    &times;
                </button>
            </div>
        )}
        </>
    )
}