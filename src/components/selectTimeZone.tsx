'use client'
import React from 'react'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { useTimezone } from '@/components/useTimezone'

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
        console.log(parsed)
    }

    return (
        <select onChange={handleChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default CustomSelect
