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
    parseDate,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { I18nProvider } from '@react-aria/i18n'
import DisplayMessage from '@/components/common/message'
import {
    convertToUserTimezone,
    generateTimeSlots,
} from '@/utils/converTimeZone'
import SelectTimezone from '@/components/timeZoneSelector'
import { useDate } from '@/hooks/useDate'
import { useEmail } from '@/hooks/useEmail'
import { getAppointments } from '@/actions'

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
    utcDate: Date
    utcTime: string
    email: string
    createdAt: Date
}

interface AddAppointmentProps {
    // handleSubmit: HandleSubmitType
    handleDateChange: (date: DateValue | null) => void
    handleTimeChange: React.ChangeEventHandler<HTMLSelectElement>
    // selectedDate: DateValue | null
    // appointments: Appointment[]
    // newDisabledRanges: CalendarDate[][]
    // availableSlots: TimeSlot[]
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
    // appointments,
    // availableSlots,
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
    // State to hold available slots based on selected date
    const [filteredSlots, setFilteredSlots] = useState<TimeSlot[]>([])

    const formatDate = (date: Date): string => {
        // Format date to yyyy-MM-dd in local timezone
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

    useEffect(() => {
        const fetchAppointments = async () => {
            const fetchedAppointments = await getAppointments()
            setAppointments(fetchedAppointments)
        }

        fetchAppointments()
    }, [])

    useEffect(() => {
        // Generate time slots based on appointments or default if empty
        const slots = generateTimeSlots(appointments)
        const convertedSlots = convertToUserTimezone(slots)
        setAvailableSlots(convertedSlots)

        console.log(convertedSlots)

        // Filter converted slots by selectedDate
        const filteredDateSlots = convertedSlots.filter((slot) => {
            // Create a Date object from selectedDate
            const selectedDateObj = selectedDate
                ? new Date(
                      selectedDate.year,
                      selectedDate.month - 1,
                      selectedDate.day
                  )
                : null

            // Compare the date parts
            return (
                selectedDateObj &&
                slot.date.toDateString() === selectedDateObj.toDateString()
            )
        })

        setFilteredSlots(filteredDateSlots)
    }, [appointments, selectedDate]) // Add selectedDate to the dependency array

    const isDateUnavailable = (date: DateValue): boolean => {
        // Convert the input date to a formatted string for comparison
        const formattedInputDate = formatDate(
            new Date(date.year, date.month - 1, date.day)
        )

        // Filter availableSlots for the specific date
        const slotsForDate = availableSlots.filter((slot) => {
            const slotDate = new Date(slot.date)
            const formattedSlotDate = formatDate(slotDate)
            return formattedSlotDate === formattedInputDate
        })

        // Check if there are any available time slots for that date
        const allSlotsTaken = slotsForDate.length === 0

        // Return true if all slots are taken (no available slots for that date)
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
                    className="max-w-md mb-4"
                    isDisabled={!selectedDate}
                    items={filteredSlots} // Use filteredSlots here
                    selectedKeys={
                        filteredSlots.some((slot) => slot.time === pickedTime)
                            ? [pickedTime]
                            : []
                    }
                    errorMessage={timeSlotError}
                    isInvalid={isTimeSlotInvalid}
                    onChange={handleTimeChange}
                >
                    {/* Map over filteredSlots instead of availableSlots */}
                    {filteredSlots.map((slot) => (
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
