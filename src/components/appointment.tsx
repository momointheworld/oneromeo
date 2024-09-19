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

interface Appointment {
    thDate: Date
    thTime: string
    csrDate: Date
    csrTime: string
    csrTimeZone: string
    email: string
    createdAt: Date
}

interface AddAppointmentProps {
    // handleSubmit: HandleSubmitType
    handleDateChange: (date: DateValue | null) => void
    handleTimeChange: React.ChangeEventHandler<HTMLSelectElement>
    // selectedDate: DateValue | null
    appointments: Appointment[]
    // newDisabledRanges: CalendarDate[][]
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
    // newDisabledRanges,
    appointments,
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

    const formatDate = (date: Date): string => {
        // Format date to yyyy-MM-dd in local timezone
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    // const isDateUnavailable = (date: DateValue): boolean => {
    //     // Convert timeSlots to user's timezone
    //     const userSlots = convertToUserTimezone(timeSlots)

    //     // Extract unique dates from the converted slots
    //     const availableDatesSet = new Set<string>()
    //     userSlots.forEach((slot) => {
    //         const slotDate = new Date(slot.date)
    //         const formattedDate = formatDate(slotDate)
    //         availableDatesSet.add(formattedDate)
    //     })

    //     // Convert the input date to a formatted string
    //     const formattedInputDate = formatDate(
    //         new Date(date.year, date.month - 1, date.day)
    //     )

    //     // Check if the formatted input date is in the set of available dates
    //     const isUnavailable = !availableDatesSet.has(formattedInputDate)

    //     return isUnavailable
    // }
    const isDateUnavailable = (date: DateValue): boolean => {
        // Convert timeSlots to user's timezone
        const userSlots = convertToUserTimezone(timeSlots)

        // Extract unique dates from the converted slots
        const availableDatesSet = new Set<string>()
        userSlots.forEach((slot) => {
            const slotDate = new Date(slot.date)
            const formattedDate = formatDate(slotDate)
            availableDatesSet.add(formattedDate)
        })

        // Convert the input date to a formatted string
        const formattedInputDate = formatDate(
            new Date(date.year, date.month - 1, date.day)
        )

        // Check if the formatted input date is in the set of available dates
        const isAvailableDate = availableDatesSet.has(formattedInputDate)

        // If the date is not available based on time slots, consider it unavailable
        if (!isAvailableDate) {
            return true
        }

        // Check if all time slots are taken for the date
        const takenSlotsForDate = appointments
            .filter((appointment) => {
                const appointmentDate = appointment.csrDate
                const formattedAppointmentDate = formatDate(appointmentDate)
                return formattedAppointmentDate === formattedInputDate
            })
            .map((appointment) => appointment.csrTime)

        // Check if all slots are taken based on the converted slots
        const allSlotsTaken = userSlots
            .filter(
                (slot) => formatDate(new Date(slot.date)) === formattedInputDate
            )
            .every((slot) => takenSlotsForDate.includes(slot.time))

        return allSlotsTaken
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
