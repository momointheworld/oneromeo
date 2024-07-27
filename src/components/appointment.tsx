'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import {
    Button,
    Chip,
    DatePicker,
    Input,
    Select,
    SelectItem,
} from '@nextui-org/react'
import {
    today,
    DateValue,
    CalendarDate,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { I18nProvider } from '@react-aria/i18n'
import DisplayMessage from '@/components/common/message'
import SelectTimeZone from '@/components/timeZoneSelector'
import { useDate } from '@/hooks/useDate'
import { useEmail } from '@/hooks/useEmail'

interface TimeSlot {
    key: string
    label: string
}

interface AddAppointmentProps {
    // handleSubmit: HandleSubmitType
    handleDateChange: (date: DateValue | null) => void
    handleTimeChange: React.ChangeEventHandler<HTMLSelectElement>
    // selectedDate: DateValue | null
    newDisabledRanges: CalendarDate[][]
    availableSlots: TimeSlot[]
    pickedTime: string
    formStateMessage: string
    isDisabled: boolean
}

const AddAppointment: React.FC<AddAppointmentProps> = ({
    // handleSubmit,
    handleDateChange,
    handleTimeChange,
    // selectedDate,
    newDisabledRanges,
    availableSlots,
    pickedTime,
    formStateMessage,
    isDisabled,
}) => {
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    const [isLoading, setIsLoading] = useState(false)
    const { selectedDate, setSelectedDate } = useDate()
    const { email, setEmail } = useEmail()

    const isDateUnavailable = (date: DateValue) => {
        // Disable all dates except Tuesday (2) and Friday (5)
        const dayOfWeek = new Date(date.year, date.month - 1, date.day).getDay()
        const isWeekdayUnavailable = dayOfWeek !== 2 && dayOfWeek !== 5

        // Combine with other disabled ranges
        const isInDisabledRange = newDisabledRanges.some(
            (interval) =>
                date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
        )

        return isWeekdayUnavailable || isInDisabledRange
    }

    return (
        <>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
                <div>
                    <SelectTimeZone isDisabled={isDisabled} />
                    <I18nProvider locale="en-US">
                        <DatePicker
                            label="Appointment day"
                            aria-label="Appointment day"
                            isDateUnavailable={isDateUnavailable}
                            minValue={startDate}
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full mb-4"
                            isDisabled={isDisabled}
                        />
                    </I18nProvider>
                </div>
                <div className="max-w-md mx-auto flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                        label=""
                        placeholder="Select a time slot"
                        className="max-w-md  mb-4"
                        isDisabled={!selectedDate}
                        items={availableSlots}
                        selectedKeys={[pickedTime]}
                        onChange={handleTimeChange}
                    >
                        {/* slot has key and label, label is what is being updated, while key is still the default value */}
                        {availableSlots.map((slot) => (
                            <SelectItem key={slot.label} value={slot.label}>
                                {slot.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="">
                    {' '}
                    <Input
                        type="email"
                        label=""
                        placeholder="Enter your email"
                        value={email}
                        onValueChange={setEmail}
                    />
                </div>
                <DisplayMessage
                    formStateMessage={formStateMessage}
                    actions={function (): Promise<FormData> {
                        throw new Error('Function not implemented.')
                    }}
                />
            </div>
        </>
    )
}

export default AddAppointment
