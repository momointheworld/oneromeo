'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    today,
    DateValue,
    CalendarDate,
    getLocalTimeZone,
} from '@internationalized/date'
import { DateTime } from 'luxon'
import { useLocale } from '@react-aria/i18n'
import { addAppointment, getAppointments } from '@/actions'
import {
    convertToUserTimezone,
    generateTimeSlots,
} from '@/utils/converTimeZone'
import { useTimezone } from '@/hooks/useTimezone'
import { useDate } from '@/hooks/useDate'
import { useEmail } from '@/hooks/useEmail'
import AddAppointment from '@/components/appointment'
import FormButton from '@/components/common/formbutton'
import paths from '@/components/paths'
import PageBreadCrumbs from '@/components/common/breadcrumbs'
import { format, toZonedTime } from 'date-fns-tz'
import { convertToThaiDateTime } from '@/utils/convertToThaiDateTime'
// import useConvertToUTC from '@/hooks/useConvertToUTC'
import { convertToUTC } from '@/utils/convertToUTCDateTime'

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
    thDate: string
    thTime: string
    csrDate: string
    csrTime: string
    csrTimeZone: string
    utcDate: string
    utcTime: string
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
    // const { convertToUTC } = useConvertToUTC()

    // useEffect(() => {
    //     if (selectedDate && availableSlots.length > 0) {
    //         // Convert the selectedDate to a Date object
    //         const selectedDateObj = new Date(
    //             selectedDate.year,
    //             selectedDate.month - 1,
    //             selectedDate.day
    //         )

    //         // Convert the selected date to a formatted string (yyyy-MM-dd) for comparison
    //         const formattedSelectedDate = formatDate(selectedDateObj)

    //         // Filter out taken slots for the selected date
    //         const takenSlots = appointments
    //             .filter((appointment) => {
    //                 const appointmentDate = new Date(appointment.utcDate)
    //                 const formattedAppointmentDate = formatDate(appointmentDate)

    //                 // Compare formatted dates to check if the appointment matches the selected date
    //                 return formattedAppointmentDate === formattedSelectedDate
    //             })
    //             .map((appointment) => appointment.utcTime) // Get the times of taken slots

    //         // Filter available slots based on the selected date and exclude taken slots
    //         const newAvailableSlots = availableSlots.filter((slot) => {
    //             const slotDate = new Date(slot.date)

    //             // Check if the slot date matches the selected date (year, month, and day)
    //             const isSameDate =
    //                 slotDate.getFullYear() === selectedDateObj.getFullYear() &&
    //                 slotDate.getMonth() === selectedDateObj.getMonth() &&
    //                 slotDate.getDate() === selectedDateObj.getDate()

    //             // Check if the time slot is not taken
    //             return isSameDate && !takenSlots.includes(slot.time)
    //         })

    //         // Update available slots in the state
    //         setAvailableSlots(newAvailableSlots)
    //     }
    // }, [selectedDate]) // Dependencies: `selectedDate`, `appointments`, `availableSlots`

    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date) // Store the selected date
    }

    const handleTimeChange = (e: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setPickedTime(e.target.value)
    }

    const combineDateAndTimeInZone = (
        date: Date,
        time: string,
        timeZone: string
    ): string => {
        const [hours, minutes] = time.split(':').map(Number)

        // Convert the JavaScript Date object to a Luxon DateTime object
        const dateTime = DateTime.fromJSDate(date).setZone(timeZone, {
            keepLocalTime: true,
        })

        // Set the time using hours and minutes
        const combinedDateTime = dateTime.set({ hour: hours, minute: minutes })

        // Return the ISO string with time zone information or throw an error if it fails
        const isoString = combinedDateTime.toISO()
        if (!isoString) {
            throw new Error(`Invalid date/time conversion for ${timeZone}`)
        }

        return isoString
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

        const { thaiDate, thaiTime } = convertToThaiDateTime(
            selectedDate,
            pickedTime,
            userTimeZone
        )

        console.log(thaiDate, thaiTime)

        // Convert to UTC before submission
        // const utcDate = convertToUTC(thaiDate, thaiTime)
        const { utcDate, utcTime } = convertToUTC(
            selectedDate,
            pickedTime,
            userTimeZone
        )

        // 1. Thai Date (Asia/Bangkok)
        const combinedThaiDate = combineDateAndTimeInZone(
            thaiDate,
            thaiTime,
            'Asia/Bangkok'
        )

        // 2. CSR Date (Local Timezone - user's timezone)
        const combinedCsrDate = combineDateAndTimeInZone(
            selectedDateObj,
            pickedTime,
            userTimeZone
        )

        // 3. UTC Date (UTC timezone)
        const combinedUtcDate = combineDateAndTimeInZone(
            utcDate,
            utcTime,
            'UTC'
        )

        try {
            // Send appointment data to the server
            await addAppointment({
                csrTimeZone: userTimeZone, // User's timezone
                thDate: combinedThaiDate,
                thTime: thaiTime,
                csrDate: combinedCsrDate,
                csrTime: pickedTime,
                utcDate: combinedUtcDate,
                utcTime,
                email,
                createdAt: new Date(),
            })

            // Reset form state after successful submission
            setSelectedDate(null)
            setPickedTime('')
            // setAvailableSlots(timeSlots)
            setFormStateMessage('Appointment added successfully.')
            // router.push(paths.showAllAppointments())
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
                            // availableSlots={availableSlots}
                            // appointments={appointments}
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
