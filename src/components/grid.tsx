import React, { ReactNode } from 'react'

interface GridLayoutProps {
    children: ReactNode
}

const GridLayout: React.FC<GridLayoutProps> = ({ children }) => {
    return (
        <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-6 bg-zinc-100 rounded">
            <div className="md:col-start-2 md:col-span-4">{children}</div>
        </div>
    )
}

export default GridLayout
