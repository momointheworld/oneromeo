import React, { createContext, useState, ReactNode, useContext } from 'react'

interface TimezoneContextProps {
    selectedTimezone: string
    setSelectedTimezone: (timezone: string) => void
}

const TimezoneContext = createContext<TimezoneContextProps | undefined>(
    undefined
)

function TimezoneProvider({ children }: { children: ReactNode }) {
    const [selectedTimezone, setSelectedTimezone] = useState<string>('')

    return (
        <TimezoneContext.Provider
            value={{ selectedTimezone, setSelectedTimezone }}
        >
            {children}
        </TimezoneContext.Provider>
    )
}

export const useTimezone = () => {
    const context = useContext(TimezoneContext)
    if (!context) {
        throw new Error('useTimezone must be used within a TimezoneProvider')
    }
    return context
}

export { TimezoneProvider, TimezoneContext }
