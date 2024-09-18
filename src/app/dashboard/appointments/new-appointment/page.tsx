'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    today,
    DateValue,
    CalendarDate,
    ZonedDateTime,
    toCalendarDate,
    GregorianCalendar,
    parseDateTime,
    parseDate,
    parseAbsolute,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { addAppointment, getAppointments } from '@/actions'
import { convertToUserTimezone, timeSlots } from '@/utils/converTimeZone'
import { useTimezone } from '@/hooks/useTimezone'
import { useDate } from '@/hooks/useDate'
import { useEmail } from '@/hooks/useEmail'
import AddAppointment from '@/components/appointment'
import FormButton from '@/components/common/formbutton'
import paths from '@/components/paths'
import PageBreadCrumbs from '@/components/common/breadcrumbs'
import { format, toZonedTime } from 'date-fns-tz'

interface Breadcrumb {
    href: string
    text: string
}

const breadcrumbs: Breadcrumb[] = [
    { href: paths.dashboard(), text: 'Dashboard' },
    { href: paths.showAllAppointments(), text: 'Appointments' },
    { href: paths.createNewAppointment(), text: `New Appointment` },
]

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

export default function CreateNewAppointment() {
    const router = useRouter()
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const { email, setEmail } = useEmail()
    const [formStateMessage, setFormStateMessage] = useState('')
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isDateInvalid, setIsDateInvalid] = useState(false)
    const [isTimeSlotInvalid, setIsTimeSlotInvalid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [dateError, setDateError] = useState('')
    const [timeSlotError, setTimeSlotError] = useState('')
    // const { selectedTimezone, setSelectedTimezone } = useTimezone()
    const { selectedDate, setSelectedDate } = useDate()
    const [pickedTime, setPickedTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState<Appointment[]>([]) // State to store fetched appointments
    const [newDisabledRanges, setNewDisabledRanges] = useState<
        CalendarDate[][]
    >([])
    // const [newDisabledRanges, setNewDisabledRanges] = useState<[CalendarDate, CalendarDate][]>([])

    // let disabledRanges = [
    //     [now.add({ days: -365 }), now], // All dates before today
    //     [endDate.add({ days: 1 }), now.add({ days: 365 })], // All dates after two weeks from tomorrow
    // ]
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                setAppointments(data)

                // Convert predefined time slots to user timezone
                const convertedSlots = convertToUserTimezone(timeSlots)

                // Get all dates from the appointments
                const dateSlotsMap = new Map<string, string[]>()

                data.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.csrDate)
                    const appointmentDateString = appointmentDate
                        .toISOString()
                        .split('T')[0] // ISO string in yyyy-MM-dd format

                    if (!dateSlotsMap.has(appointmentDateString)) {
                        dateSlotsMap.set(appointmentDateString, [])
                    }

                    // Retrieve the slots array safely
                    const slots = dateSlotsMap.get(appointmentDateString)
                    if (slots) {
                        slots.push(appointment.csrTime)
                    }
                })

                // Determine unavailable dates based on appointments
                const unavailableDates: Date[] = []
                dateSlotsMap.forEach((slots, date) => {
                    if (slots.length === 2) {
                        unavailableDates.push(new Date(date)) // Date in yyyy-MM-dd format
                    }
                })

                // Convert Date to CalendarDate using the Gregorian calendar
                const calendarDates = unavailableDates.map((date) => {
                    const calendarDate: CalendarDate = new CalendarDate(
                        new GregorianCalendar(),
                        date.getUTCFullYear(),
                        date.getUTCMonth() + 1,
                        date.getUTCDate()
                    )
                    return calendarDate
                })

                // Update disabledRanges with the new unavailable dates as CalendarDate
                setNewDisabledRanges(() => [
                    ...calendarDates.map((date) => [date, date]),
                ])

                // Filter converted slots based on unavailable dates
                const updatedAvailableSlots = convertedSlots.filter(
                    (slot) =>
                        !unavailableDates.some(
                            (unavailableDate) =>
                                slot.date.toISOString().split('T')[0] ===
                                unavailableDate.toISOString().split('T')[0]
                        )
                )
                setAvailableSlots(updatedAvailableSlots)
            } catch (error) {
                console.error('Error fetching appointments:', error)
            }
        }

        // Fetch appointments when component mounts
        fetchAppointments()
    }, [])

    useEffect(() => {
        if (!selectedDate) return

        // Convert the selectedDate to a Date object
        const selectedDateObj = new Date(
            selectedDate.year,
            selectedDate.month - 1,
            selectedDate.day
        )

        // Filter appointments that match the selected date
        const takenSlots = appointments
            .filter((appointment) => {
                const appointmentDate = new Date(appointment.csrDate) // Assuming 'csrDate' is a Date string
                return (
                    appointmentDate.getFullYear() ===
                        selectedDateObj.getFullYear() &&
                    appointmentDate.getMonth() === selectedDateObj.getMonth() &&
                    appointmentDate.getDate() === selectedDateObj.getDate()
                ) // Compare year, month, and day
            })
            .map((appointment) => appointment.csrTime) // Assuming 'csrTime' holds the booked time slot in 'HH:mm' format

        // Filter out the unavailable time slots for the selected date
        const newAvailableSlots = convertToUserTimezone(
            timeSlots.filter((slot) => {
                const slotDate = new Date(slot.date)
                // Check if the slot date matches the selected date
                const isSameDate =
                    slotDate.getFullYear() === selectedDateObj.getFullYear() &&
                    slotDate.getMonth() === selectedDateObj.getMonth() &&
                    slotDate.getDate() === selectedDateObj.getDate()

                // Check if the time slot is not taken
                return isSameDate && !takenSlots.includes(slot.time)
            })
        )

        // Update available slots in the state
        setAvailableSlots(newAvailableSlots)
    }, [selectedDate, appointments])

    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date) // Store the selected date
        const newSlots = convertToUserTimezone(timeSlots)
        setAvailableSlots(newSlots)
        console.log(newSlots)
    }

    const handleTimeChange = (e: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setPickedTime(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        // Reset error states
        setIsDateInvalid(false)
        setIsTimeSlotInvalid(false)
        setIsEmailInvalid(false)
        setDateError('')
        setTimeSlotError('')
        setEmailError('')

        // Validate inputs
        if (!selectedDate) {
            setIsDateInvalid(true)
            setDateError('Please choose a date')
            setIsLoading(false)
            return
        } else if (!pickedTime) {
            setIsTimeSlotInvalid(true)
            setTimeSlotError('Please choose a time slot')
            setIsLoading(false)
            return
        } else if (!email) {
            setIsEmailInvalid(true)
            setEmailError('Invalid email')
            setIsLoading(false)
            return
        }

        // Get the user's timezone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

        // Convert selected date to the local time zone
        const selectedDateObj = new Date(
            selectedDate.year,
            selectedDate.month - 1,
            selectedDate.day
        )

        // Get UTC date (raw date without any conversion)
        const utcDate = selectedDateObj.toISOString()

        // Current timestamp for appointment creation
        const createdAt = new Date().toISOString()

        try {
            // Send appointment data to the server
            await addAppointment({
                csrTimeZone: userTimeZone, // User's timezone
                thDate,
                thTime,
                csrDate: csrTime,
                email,
                createdAt,
            })

            // Reset form state after successful submission
            setSelectedDate(null)
            setPickedTime('')
            setAvailableSlots(timeSlots)
            setFormStateMessage('Appointment added successfully.')
            router.push(paths.showAllAppointments())
        } catch (error) {
            setFormStateMessage(
                'Failed to add the appointment, try again later.'
            )
            console.error('Error adding appointment:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <PageBreadCrumbs items={breadcrumbs} />
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
                            isEmailInvalid={isEmailInvalid}
                            isDateInvalid={isDateInvalid}
                            isTimeSlotInvalid={isTimeSlotInvalid}
                            emailError={emailError}
                            dateError={dateError}
                            timeSlotError={timeSlotError}
                        />
                    </div>
                    <FormButton color="primary">Add Appointment</FormButton>
                </div>
            </form>
        </div>
    )
}
