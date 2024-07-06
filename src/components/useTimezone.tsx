import React, { createContext, useState, ReactNode, useContext } from 'react'

interface TimezoneContextProps {
    selectedTimeZone: string
    setSelectedTimeZone: (timezone: string) => void
}

const TimezoneContext = createContext<TimezoneContextProps | undefined>(
    undefined
)

function TimezoneProvider({ children }: { children: ReactNode }) {
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('')

    return (
        <TimezoneContext.Provider
            value={{ selectedTimeZone, setSelectedTimeZone }}
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
