import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the shape of the context value
interface SelectedItemContextType {
    selectedPriceId: string | null
    setSelectedPriceId: (priceId: string | null) => void
}

// Create the context with a default value
const SelectedItemContext = createContext<SelectedItemContextType>({
    selectedPriceId: null,
    setSelectedPriceId: () => {}, // No-op function as a default
})

export const useSelectedItem = () => useContext(SelectedItemContext)

export const SelectedItemProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null)

    return (
        <SelectedItemContext.Provider
            value={{ selectedPriceId, setSelectedPriceId }}
        >
            {children}
        </SelectedItemContext.Provider>
    )
}
