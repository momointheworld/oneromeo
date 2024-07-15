// EmailContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface EmailContextType {
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string>>
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)
// Function declaration for EmailProvider
function EmailProvider({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState<string>('')

    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    )
}

export const useEmail = (): EmailContextType => {
    const context = useContext(EmailContext)
    if (!context) {
        throw new Error('useEmail must be used within an EmailProvider')
    }
    return context
}

export { EmailProvider, EmailContext }
