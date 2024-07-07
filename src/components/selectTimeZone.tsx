'use client'
import React, { useState } from 'react'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { useTimezone } from '@/components/useTimezone'
import { Select, SelectItem } from '@nextui-org/react'

const labelStyle = 'original'
const timezones = {
    ...allTimezones,
}

const CustomSelect: React.FC = () => {
    const { options, parseTimezone } = useTimezoneSelect({
        labelStyle,
        timezones,
    })
    const { setSelectedTimeZone } = useTimezone()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsed = parseTimezone(e.target.value)
        setSelectedTimeZone(parsed?.value || '')
    }

    return (
        <select onChange={handleChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {/* {option.label} */}
                    {option.label}
                </option>
            ))}
        </select>
    )
}
//     const { setSelectedTimeZone } = useTimezone()
//     const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const parsed = parseTimezone(e.target.value)
//         setSelectedTimeZone(parsed?.value || '')
//         console.log(parsed)
//     }

//     return (
//         <div className="flex w-full max-w-xs flex-col gap-2">
//             <Select
//                 onChange={() => handleChange}
//                 items={options}
//                 selectionMode="single"
//                 label="Pick a timezone"
//             >
//                 {(item) => (
//                     <SelectItem key={item.value} textValue={item.label}>
//                         {item.label}
//                     </SelectItem>
//                 )}
//             </Select>
//         </div>
//     )
// }

export default CustomSelect
