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
import { addAppointment } from '@/actions/addappointment'
import { getAppointments } from '@/actions'
import AddAppointment from '@/components/appointment'

interface CustomDateValue {
    year: number
    month: number
    day: number
    era: string
    calendar: { identifier: string }
}

interface AppointmentData {
    date: Date
    timeSlot: string
}

export default function NewAppointment() {
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const timeSlots = [
        { key: '10am-11am', label: '10am-11am' },
        { key: '3pm-4pm', label: '3pm-4pm' },
    ]
    const [formStateMessage, setFormStateMessage] = useState('')
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)
    const [availableSlots, setAvailableSlots] = useState(timeSlots)
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

                    dateSlotsMap.get(appointmentDate).push(appointment.timeSlot)
                })

                // Find dates that have two or more time slots taken
                const unavailableDates: Date[] = []
                dateSlotsMap.forEach((slots, date) => {
                    if (slots.length >= 2) {
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

    const convertToDate = (customDate: CustomDateValue): Date => {
        return new Date(customDate.year, customDate.month - 1, customDate.day)
    }

    // Check availability of time slots for the selected date
    const checkTimeSlots = (selectedDate: DateValue | null) => {
        if (!selectedDate) return

        const selectedDateStr = new Date(selectedDate.toString()).toDateString()

        const takenSlots = appointments
            .filter(
                (appointment) =>
                    new Date(appointment.date).toDateString() ===
                    selectedDateStr
            )
            .map((appointment) => appointment.timeSlot)

        const newAvailableSlots = timeSlots.filter(
            (slot) => !takenSlots.includes(slot.key)
        )
        setAvailableSlots(newAvailableSlots)
    }

    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        setPickedTime('')
        checkTimeSlots(date)
    }

    const handleTimeChange = (e: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setPickedTime(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // Prevent default form submission

        if (!selectedDate || !pickedTime) {
            alert('Please select a date and time slot.')
            return
        }
        setIsLoading(true)

        if (selectedDate && pickedTime) {
            const appointmentData: AppointmentData = {
                date: convertToDate(selectedDate),
                timeSlot: pickedTime,
            }
            try {
                await addAppointment(appointmentData)
                // Reset the form
                setSelectedDate(null)
                setPickedTime('')
                setAvailableSlots(timeSlots)
                // Optionally, you can add a success message or navigate to another page here
                setFormStateMessage('Appointment added successfully.')
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
        <AddAppointment
            handleSubmit={handleSubmit}
            handleDateChange={handleDateChange}
            handleTimeChange={handleTimeChange}
            selectedDate={selectedDate}
            pickedTime={pickedTime}
            newDisabledRanges={newDisabledRanges}
            availableSlots={availableSlots}
            formStateMessage={formStateMessage}
        />
    )
}
