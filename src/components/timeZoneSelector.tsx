'use client'
import React from 'react'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { useTimezone } from '@/hooks/useTimezone'
import { Select, SelectItem } from '@nextui-org/react'
import { useDate } from '@/hooks/useDate'

const labelStyle = 'original'
const timezones = {
    ...allTimezones,
}

interface TimezoneSelectorProps {
    isDisabled: boolean
    timezoneError: string
    isTimezoneInvalid: boolean
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
    isDisabled,
    isTimezoneInvalid,
    timezoneError,
}) => {
    const { options, parseTimezone } = useTimezoneSelect({
        labelStyle,
        timezones,
    })
    const { selectedTimezone, setSelectedTimezone } = useTimezone()
    const { selectedDate, setSelectedDate } = useDate()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsed = parseTimezone(e.target.value)
        setSelectedTimezone(parsed?.value || '')
        setSelectedDate(null) // Reset the selected date to null when timezone changes
    }

    return (
        <div className="flex w-full flex-col gap-2 my-4">
            <Select
                onChange={handleChange}
                selectionMode="single"
                label="Pick a time zone"
                value={selectedTimezone}
                isInvalid={isTimezoneInvalid}
                isDisabled={isDisabled}
                errorMessage={timezoneError}
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

export default TimezoneSelector
