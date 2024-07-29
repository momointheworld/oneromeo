'use client'
import React, { useState } from 'react'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { useTimezone } from '@/hooks/useTimezone'
import { Select, SelectItem } from '@nextui-org/react'
import { useDate } from '@/hooks/useDate'

const labelStyle = 'original'
const timezones = {
    ...allTimezones,
}

interface TimeZoneSelectorProps {
    isDisabled: boolean
    timeZoneError: string
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({
    isDisabled,
    timeZoneError,
}) => {
    const { options, parseTimezone } = useTimezoneSelect({
        labelStyle,
        timezones,
    })
    const { selectedTimeZone, setSelectedTimeZone } = useTimezone()
    const { selectedDate, setSelectedDate } = useDate()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsed = parseTimezone(e.target.value)
        setSelectedTimeZone(parsed?.value || '')
        setSelectedDate(null) // Reset the selected date to null when timezone changes
    }

    return (
        <div className="flex w-full flex-col gap-2 my-4">
            <Select
                onChange={handleChange}
                selectionMode="single"
                label="Pick a time zone"
                value={selectedTimeZone}
                isDisabled={isDisabled}
                errorMessage={timeZoneError}
            >
                {options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    )
}

export default TimeZoneSelector
