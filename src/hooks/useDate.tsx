import { DateValue } from '@nextui-org/react'
import React, { createContext, useState, ReactNode, useContext } from 'react'

interface DateContextProps {
    selectedDate: DateValue | null
    setSelectedDate: (date: DateValue | null) => void
}

const DateContext = createContext<DateContextProps | undefined>(undefined)

function DateProvider({ children }: { children: ReactNode }) {
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </DateContext.Provider>
    )
}

export const useDate = () => {
    const context = useContext(DateContext)
    if (!context) {
        throw new Error('useDate must be used within a DateProvider')
    }
    return context
}

export { DateProvider, DateContext }
