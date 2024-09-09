'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    today,
    DateValue,
    CalendarDate,
    ZonedDateTime,
    toCalendarDate,
    parseAbsolute,
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
import paths from '@/components/paths'
import PageBreadCrumbs from '@/components/common/breadcrumbs'

interface Breadcrumb {
    href: string
    text: string
}

const breadcrumbs: Breadcrumb[] = [
    { href: paths.dashboard(), text: 'Dashboard' },
    { href: paths.showAllAppointments(), text: 'Appointments' },
    { href: paths.createNewAppointment(), text: `New Appointment` },
]

export default function CreateNewAppointment() {
    interface AppointmentData {
        timeZone: string
        date: Date
        thTimeSlot: string
        csrTimeSlot: string
        email: string
    }
    const router = useRouter()
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const { email, setEmail } = useEmail()
    const [formStateMessage, setFormStateMessage] = useState('')
    const [availableSlots, setAvailableSlots] = useState(timeSlots)
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isDateInvalid, setIsDateInvalid] = useState(false)
    const [isTimeSlotInvalid, setIsTimeSlotInvalid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [dateError, setDateError] = useState('')
    const [timeSlotError, setTimeSlotError] = useState('')
    const { selectedTimezone, setSelectedTimezone } = useTimezone()
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

    // // Fetch appointments and update disabledRanges on component mount
    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         try {
    //             const data = await getAppointments()
    //             setAppointments(data)

    //             // Get all dates from the appointments
    //             const dateSlotsMap = new Map()

    //             data.forEach((appointment) => {
    //                 const appointmentDate = new Date(
    //                     appointment.date
    //                 ).toDateString()

    //                 if (!dateSlotsMap.has(appointmentDate)) {
    //                     dateSlotsMap.set(appointmentDate, [])
    //                 }

    //                 dateSlotsMap
    //                     .get(appointmentDate)
    //                     .push(appointment.thTimeSlot)
    //             })

    //             // Find dates that have three slots taken
    //             const unavailableDates: Date[] = []
    //             dateSlotsMap.forEach((slots, date) => {
    //                 if (slots.length === 2) {
    //                     unavailableDates.push(new Date(date))
    //                 }
    //             })

    //             // Convert unavailableDates to ZonedDateTime
    //             const zonedDateTimeDates = unavailableDates.map((date) =>
    //                 parseAbsoluteToLocal(date.toISOString())
    //             )

    //             // Convert ZonedDateTime to CalendarDate
    //             const calendarDates = zonedDateTimeDates.map((date) =>
    //                 toCalendarDate(date)
    //             )

    //             // Update disabledRanges with the new unavailable dates as CalendarDate
    //             setNewDisabledRanges(() => [
    //                 ...disabledRanges,
    //                 // ...calendarDates.map((date) => [date, date]),
    //             ])
    //         } catch (error) {
    //             console.error('Error fetching appointments:', error)
    //         }
    //     }

    //     // Fetch appointments when component mounts
    //     fetchAppointments()
    // }, []) // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                setAppointments(data)

                // Get all dates from the appointments
                const dateSlotsMap = new Map()

                data.forEach((appointment) => {
                    // Convert the appointment date to Asia/Bangkok timezone
                    const appointmentDate = parseAbsolute(
                        new Date(appointment.date).toISOString(),
                        'Asia/Bangkok'
                    )

                    const appointmentDateString = appointmentDate.toString()
                    const isoDate = appointmentDateString.replace(
                        /\[.*?\]/g,
                        ''
                    )

                    if (!dateSlotsMap.has(isoDate)) {
                        dateSlotsMap.set(isoDate, [])
                    }

                    dateSlotsMap.get(isoDate).push(appointment.thTimeSlot)
                })

                // Find dates that have two slots taken
                const unavailableDates: ZonedDateTime[] = [] // Change the type to ZonedDateTime[]
                dateSlotsMap.forEach((slots, date) => {
                    if (slots.length === 2) {
                        unavailableDates.push(
                            parseAbsolute(date, 'Asia/Bangkok')
                        )
                    }
                })

                // Convert ZonedDateTime (in Bangkok) to CalendarDate
                const calendarDates = unavailableDates.map((zonedDateTime) =>
                    toCalendarDate(zonedDateTime)
                )

                console.log(dateSlotsMap)
                console.log(calendarDates) // Now you will see the calendar dates

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
        const selectedDateStr = selectedDate
            .toDate('asia/bangkok')
            .toDateString()

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
                dateObj
            )
            setAvailableSlots(convertedSlots)
        }
    }, [selectedDate, appointments, selectedTimezone])

    // Function to handle date change
    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        setPickedTime('')

        if (date) {
            const dateObj = new Date(date.year, date.month - 1, date.day)
            const convertedSlots = convertToUserTimezone(
                availableSlots,
                dateObj
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

        // Reset error states
        setIsDateInvalid(false)
        setIsTimeSlotInvalid(false)
        setIsEmailInvalid(false)
        setDateError('')
        setTimeSlotError('')
        setEmailError('')

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

        if (selectedDate && pickedTime) {
            const localTimezone =
                Intl.DateTimeFormat().resolvedOptions().timeZone

            // convert to the local time zone
            // const dateObj = selectedDate?.toDate(localTimezone)
            const dateObj = selectedDate.toDate('asia/bangkok')

            const updatedTimeSlots = convertToUserTimezone(timeSlots, dateObj)
            let thTimeSlot = updatedTimeSlots.find(
                (slot) => slot.label === pickedTime
            )
            console.log(pickedTime)

            console.log(thTimeSlot)

            if (!thTimeSlot || !thTimeSlot.label) {
                thTimeSlot = {
                    key: '05:30 PM - 05:45 PM',
                    start: '05:30',
                    end: '05:45',
                    period: 'PM',
                    label: '05:30 PM - 05:45 PM', // Default label, can be updated after conversion
                }
            }
            // label is updated while key is unchanged
            const thLabel = thTimeSlot.key
            const label = `${pickedTime} (${thLabel})`

            try {
                await addAppointment({
                    timeZone: localTimezone,
                    date: dateObj,
                    thTimeSlot: thLabel,
                    csrTimeSlot: pickedTime,
                    email,
                })
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
