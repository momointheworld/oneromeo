'use client'
import React, { useEffect, useState } from 'react'
import {
    today,
    DateValue,
    CalendarDate,
    toCalendarDate,
    parseAbsoluteToLocal,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { addAppointment, getAppointments } from '@/actions'
import { convertToUserTimezone, timeSlots } from '@/utils/converTimeZone'
import { useTimezone } from '@/hooks/useTimezone'
import { useDate } from '@/hooks/useDate'
import { useEmail } from '@/hooks/useEmail'
import { revertTimezone } from '@/utils/revertTimeZone'
import AddAppointment from '@/components/appointment'
import FormButton from '@/components/common/formbutton'
import { Chip } from '@nextui-org/react'

export default function CreateNewAppointment() {
    interface AppointmentData {
        timeZone: string
        date: Date
        thTimeSlot: string
        csrTimeSlot: string
        email: string
    }

    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const { email, setEmail } = useEmail()
    const [formStateMessage, setFormStateMessage] = useState('')
    const [availableSlots, setAvailableSlots] = useState(timeSlots)
    const { selectedTimeZone, setSelectedTimeZone } = useTimezone()
    const { selectedDate, setSelectedDate } = useDate()
    const [pickedTime, setPickedTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState<AppointmentData[]>([]) // State to store fetched appointments
    const [newDisabledRanges, setNewDisabledRanges] = useState<
        CalendarDate[][]
    >([])

    let disabledRanges = [
        [now.add({ days: -365 }), now], // All dates before today
        [endDate.add({ days: 1 }), now.add({ days: 365 })], // All dates after two weeks from tomorrow
    ]

    // Fetch appointments and update disabledRanges on component mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                setAppointments(data)

                // Get all dates from the appointments
                const dateSlotsMap = new Map()

                data.forEach((appointment) => {
                    const appointmentDate = new Date(
                        appointment.date
                    ).toDateString()

                    if (!dateSlotsMap.has(appointmentDate)) {
                        dateSlotsMap.set(appointmentDate, [])
                    }

                    dateSlotsMap
                        .get(appointmentDate)
                        .push(appointment.thTimeSlot)
                })

                // Find dates that have three slots taken
                const unavailableDates: Date[] = []
                dateSlotsMap.forEach((slots, date) => {
                    if (slots.length === 3) {
                        unavailableDates.push(new Date(date))
                    }
                })

                // Convert unavailableDates to ZonedDateTime
                const zonedDateTimeDates = unavailableDates.map((date) =>
                    parseAbsoluteToLocal(date.toISOString())
                )

                // Convert ZonedDateTime to CalendarDate
                const calendarDates = zonedDateTimeDates.map((date) =>
                    toCalendarDate(date)
                )

                // Update disabledRanges with the new unavailable dates as CalendarDate
                setNewDisabledRanges(() => [
                    ...disabledRanges,
                    ...calendarDates.map((date) => [date, date]),
                ])
            } catch (error) {
                console.error('Error fetching appointments:', error)
            }
        }

        // Fetch appointments when component mounts
        fetchAppointments()
    }, []) // Empty dependency array ensures this runs only once on mount

    // UseEffect to check availability of time slots for the selected date
    useEffect(() => {
        if (!selectedDate) return

        const selectedDateStr = new Date(selectedDate.toString()).toDateString()

        const takenSlots = appointments
            .filter(
                (appointment) =>
                    new Date(appointment.date).toDateString() ===
                    selectedDateStr
            )
            .map((appointment) => appointment.thTimeSlot)

        const newAvailableSlots = timeSlots.filter(
            (slot) => !takenSlots.includes(slot.label)
        )
        // setAvailableSlots(newAvailableSlots)
        if (selectedDate) {
            const dateObj = new Date(
                selectedDate.year,
                selectedDate.month - 1,
                selectedDate.day
            )
            const convertedSlots = convertToUserTimezone(
                newAvailableSlots,
                dateObj,
                selectedTimeZone
            )
            setAvailableSlots(convertedSlots)
        }
    }, [selectedDate, appointments, selectedTimeZone])

    // Function to handle date change
    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        // checkTimeSlots(date)
        setPickedTime('')

        if (date) {
            const dateObj = new Date(date.year, date.month - 1, date.day)
            const convertedSlots = convertToUserTimezone(
                availableSlots,
                dateObj,
                selectedTimeZone
            )
            setAvailableSlots(convertedSlots)
        }
    }

    const handleTimeChange = (e: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setPickedTime(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // Prevent default form submission
        setIsLoading(true)
        if (!selectedDate) {
            alert('Please select a date.')
            setIsLoading(false)
            return
        } else if (!pickedTime) {
            alert('Please select a time slot.')
            setIsLoading(false)
            return
        } else if (!selectedTimeZone) {
            alert('Please select a time zone.')
            setIsLoading(false)
            return
        }

        if (selectedDate && pickedTime && selectedTimeZone) {
            const dateStr = new Date(selectedDate.toString())
            // Convert the customer time slot label to the Thai time slot label
            let thTimeSlot = revertTimezone(
                pickedTime,
                dateStr,
                selectedTimeZone
            )

            if (!thTimeSlot || !thTimeSlot.label) {
                thTimeSlot = {
                    key: '09:30 PM - 09:45 PM',
                    start: '09:30',
                    end: '09:45',
                    period: 'PM',
                    label: '09:30 PM - 09:45 PM', // Default label, can be updated after conversion
                }
            }
            const thLabel = thTimeSlot.label
            const label = `${pickedTime} (${thLabel})`
            try {
                await addAppointment({
                    timeZone: selectedTimeZone,
                    date: dateStr,
                    thTimeSlot: thLabel,
                    csrTimeSlot: pickedTime,
                    email,
                })
                setSelectedDate(null)
                setPickedTime('')
                setAvailableSlots(timeSlots)
                // Optionally, you can add a success message or navigate to another page here
                setFormStateMessage('Appointment added successfully.')
                // Fetch the updated appointments list
                const updatedAppointments = await getAppointments()
                const formattedAppointments: AppointmentData[] =
                    updatedAppointments.map((appointment) => ({
                        id: appointment.id,
                        date: new Date(appointment.date),
                        timeZone: appointment.timeZone,
                        thTimeSlot: appointment.thTimeSlot,
                        csrTimeSlot: appointment.csrTimeSlot,
                        email: appointment.email,
                    }))

                // Sort appointments by date in descending order
                const sortedAppointments = formattedAppointments.sort(
                    (a, b) => b.date.getTime() - a.date.getTime()
                )

                setAppointments(sortedAppointments)

                // Reset message after 5 seconds
                setTimeout(() => {
                    setFormStateMessage('')
                }, 5000)
            } catch (error) {
                setFormStateMessage(
                    'Failed to add the appointment, try again later.'
                )
                console.error('Error adding appointment:', error)
                // Handle error scenario if needed
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex place-content-center">
                <span className="mx-5 text-2xl font-bold tracking-tight text-gray-900">
                    Add An Appointment
                </span>
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-y-5">
                <div className="w-full">
                    <AddAppointment
                        handleDateChange={handleDateChange}
                        handleTimeChange={handleTimeChange}
                        newDisabledRanges={newDisabledRanges}
                        availableSlots={availableSlots}
                        pickedTime={pickedTime}
                        formStateMessage={formStateMessage}
                        isDisabled={false}
                    />
                </div>
                <FormButton color="primary">Add Appointment</FormButton>
            </div>
        </form>
    )
}
