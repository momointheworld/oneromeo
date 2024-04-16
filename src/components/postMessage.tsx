'use client';
import { useEffect, useState } from "react";

// interface FormState {
//     message: string;
//     // Other properties related to your form state
// }
// interface FormDataProps {
//     date: Date,
//     title: string,
//     slug: string,            
//     categoryNames: string[]; 
//     body: string,
// }

interface actionProps {
    // actions: (formState: FormState, formData: FormDataProps)=> Promise<FormState>;
    formStateMessage: string; // Initial message to display
}

export default function DisplayPostMessage({formStateMessage}: actionProps) {
    const [messageVisible, setMessageVisible] = useState(false);  
    const [message, setMessage] = useState(''); 

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