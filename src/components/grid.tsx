import React, { ReactNode } from 'react'

interface GridLayoutProps {
    children: ReactNode
}

const GridLayout: React.FC<GridLayoutProps> = ({ children }) => {
    return (
        <div className="grid grid-cols-1 gap-4 px-6 py-3 md:px-6 md:grid-cols-6 lg:grid-cols-4 rounded">
            <div className="col-span-1 md:col-start-2 md:col-span-4 lg:col-start-2 lg:col-span-2">
                {children}
            </div>
        </div>
    )
}

export default GridLayout
