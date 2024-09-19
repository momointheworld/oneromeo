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
    // const [newDisabledRanges, setNewDisabledRanges] = useState<
    //     CalendarDate[][]
    // >([])

    useEffect(() => {
        const fetchAndUpdateSlots = async () => {
            try {
                // Fetch appointments data
                const data = await getAppointments()
                setAppointments(data)

                // Convert timeSlots to user timezone
                const newSlots = convertToUserTimezone(timeSlots)

                console.log(newSlots)

                // Extract unique dates from the converted slots
                const dateSet = new Set<string>()
                newSlots.forEach((slot) => {
                    const date = new Date(slot.date).toISOString().split('T')[0] // Extract yyyy-MM-dd
                    dateSet.add(date)
                })

                if (selectedDate) {
                    // Convert the selectedDate to a Date object
                    const selectedDateObj = new Date(
                        selectedDate.year,
                        selectedDate.month - 1,
                        selectedDate.day
                    )

                    // Filter appointments that match the latest month
                    const takenSlots = appointments
                        .filter((appointment) => {
                            const appointmentDate = new Date(
                                appointment.csrDate
                            ) // Assuming 'csrDate' is a Date string
                            return (
                                appointmentDate.getFullYear() ===
                                    selectedDateObj.getFullYear() &&
                                appointmentDate.getMonth()
                            ) // Compare year and latest month
                        })
                        .map((appointment) => appointment.csrTime)

                    // Filter out the unavailable time slots for the selected date
                    const newAvailableSlots = newSlots.filter((slot) => {
                        const slotDate = new Date(slot.date)

                        // Check if the slot date matches the selected date (year, month, and day)
                        const isSameDate =
                            slotDate.getFullYear() ===
                                selectedDateObj.getFullYear() &&
                            slotDate.getMonth() ===
                                selectedDateObj.getMonth() &&
                            slotDate.getDate() === selectedDateObj.getDate()

                        // Check if the time slot is not taken
                        return isSameDate && !takenSlots.includes(slot.time)
                    })

                    // Update available slots in the state
                    setAvailableSlots(newAvailableSlots)
                }
            } catch (error) {
                console.error('Error fetching appointments:', error)
            }
        }

        fetchAndUpdateSlots()
    }, [selectedDate]) // Include `timeSlots` in the dependency array

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
                            // newDisabledRanges={newDisabledRanges}
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
