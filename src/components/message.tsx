'use client';
import { useEffect, useRef, useState } from "react";

interface actionProps {
    actions: () => Promise<FormData>; // Function to initialize form state
    formStateMessage: string; // Initial message to display
}

// A universal display message function since postMessage has a different props for Post alone.
export default function DisplayMessage({formStateMessage}: actionProps) {
    const [messageVisible, setMessageVisible] = useState(false);  
    const [message, setMessage] = useState(''); 
    const errorMessageRef = useRef<HTMLDivElement>(null); // Reference to the error message element

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
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div ref={errorMessageRef} className='bg-zinc-200 text-gray-700 px-5 rounded flex flex-row justify-between'>
                        <p className='self-center'>{formStateMessage}</p>
                        <button
                            className="font-bold hover:text-gray-700 ml-3"
                            onClick={closeMessage}
                        >
                        &times;
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}