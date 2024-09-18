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
import { convertToUserTimezone, timeSlots } from '@/utils/converTimeZone'
import SelectTimezone from '@/components/timeZoneSelector'
import { useDate } from '@/hooks/useDate'
import { useEmail } from '@/hooks/useEmail'

interface TimeSlot {
    time: string
    date: Date
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
    isEmailInvalid: boolean
    // isTimezoneInvalid: boolean
    isDateInvalid: boolean
    isTimeSlotInvalid: boolean
    isDisabled: boolean
    // timezoneError: string
    emailError: string
    dateError: string
    timeSlotError: string
}

const AddAppointment: React.FC<AddAppointmentProps> = ({
    handleDateChange,
    handleTimeChange,
    newDisabledRanges,
    availableSlots,
    pickedTime,
    formStateMessage,
    isEmailInvalid,
    // isTimezoneInvalid,
    isDateInvalid,
    isTimeSlotInvalid,
    isDisabled,
    // timezoneError,
    emailError,
    dateError,
    timeSlotError,
}) => {
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let endDate = now.add({ days: 30 })
    let { locale } = useLocale()
    const [isLoading, setIsLoading] = useState(false)
    const { selectedDate, setSelectedDate } = useDate()
    const { email, setEmail } = useEmail()
    const isDateUnavailable = (date: DateValue): boolean => {
        // Convert DateValue to CalendarDate
        const dateToCompare = new CalendarDate(date.year, date.month, date.day)

        // Get current date and the date 30 days from now
        const today = new Date()
        const thirtyDaysFromNow = new Date(today)
        thirtyDaysFromNow.setDate(today.getDate() + 30)

        // Convert timeSlots to user timezone
        const newSlots = convertToUserTimezone(timeSlots)

        // Extract unique dates from the converted slots within the next 30 days
        const dateSet = new Set<string>()
        newSlots.forEach((slot) => {
            const slotDate = new Date(slot.date)
            if (slotDate >= today && slotDate <= thirtyDaysFromNow) {
                const formattedDate = slotDate.toISOString().split('T')[0] // Extract yyyy-MM-dd
                dateSet.add(formattedDate)
            }
        })

        // Convert date strings to CalendarDate objects
        const availableDates: CalendarDate[] = Array.from(dateSet).map(
            (dateString) => {
                const [year, month, day] = dateString.split('-').map(Number)
                return new CalendarDate(year, month, day)
            }
        )

        // Check if the date is within the next 30 days and is not in the unavailableDates
        const isWithinRange =
            dateToCompare.compare(
                new CalendarDate(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    today.getDate()
                )
            ) >= 0 &&
            dateToCompare.compare(
                new CalendarDate(
                    thirtyDaysFromNow.getFullYear(),
                    thirtyDaysFromNow.getMonth() + 1,
                    thirtyDaysFromNow.getDate()
                )
            ) <= 0

        return (
            isWithinRange &&
            !availableDates.some(
                (availableDate) => availableDate.compare(dateToCompare) === 0
            )
        )
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <div>
                <I18nProvider locale="en-US">
                    <DatePicker
                        label="Appointment day"
                        aria-label="Appointment day"
                        isDateUnavailable={isDateUnavailable}
                        minValue={startDate}
                        maxValue={endDate}
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full mb-4"
                        isDisabled={isDisabled}
                        isInvalid={isDateInvalid}
                        errorMessage={dateError}
                    />
                </I18nProvider>
            </div>
            <div className="max-w-md mx-auto flex w-full flex-wrap md:flex-nowrap gap-4">
                <Select
                    aria-label="Select a time slot" // Provide aria-label for accessibility
                    placeholder="Select a time slot"
                    className="max-w-md  mb-4"
                    isDisabled={!selectedDate}
                    items={availableSlots}
                    selectedKeys={[pickedTime]}
                    errorMessage={timeSlotError}
                    isInvalid={isTimeSlotInvalid}
                    onChange={handleTimeChange}
                >
                    {/* slot has key and label, label is what is being updated, while key is still the default value */}
                    {availableSlots.map((slot) => (
                        <SelectItem key={slot.time} value={slot.time}>
                            {slot.time}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div>
                {' '}
                <Input
                    type="email"
                    aria-label="Enter your email" // Provide aria-label for accessibility
                    placeholder="Enter your email"
                    value={email}
                    onValueChange={setEmail}
                    isInvalid={isEmailInvalid}
                    errorMessage={emailError}
                />
            </div>
            <DisplayMessage formStateMessage={formStateMessage} />
        </div>
    )
}

export default AddAppointment
