'use client'
import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Select, SelectItem } from '@nextui-org/react'
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
import { I18nProvider } from '@react-aria/i18n'

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

const convertToDate = (customDate: CustomDateValue): Date => {
    return new Date(customDate.year, customDate.month - 1, customDate.day)
}

const AddAppointment = () => {
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)
    const [pickedTime, setPickedTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState<AppointmentData[]>([]) // State to store fetched appointments
    const [newDisabledRanges, setNewDisabledRanges] = useState<
        CalendarDate[][]
    >([])

    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow

    const timeSlots = [
        { key: '10am-11am', label: '10am-11am' },
        { key: '3pm-4pm', label: '3pm-4pm' },
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

                console.log('Unavailable Slots:', newDisabledRanges)
            } catch (error) {
                console.error('Error fetching appointments:', error)
            }
        }

        // Fetch appointments when component mounts
        fetchAppointments()
    }, []) // Empty dependency array ensures this runs only once on mount

    console.log('Unavailable Slots:', newDisabledRanges)

    let disabledRanges = [
        [now.add({ days: -365 }), now], // All dates before today
        [endDate.add({ days: 1 }), now.add({ days: 365 })], // All dates after two weeks from tomorrow
    ]

    let isDateUnavailable = (date: DateValue) =>
        newDisabledRanges.some(
            (interval) =>
                date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
        )

    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        setPickedTime('')
    }

    const handleSelectionChange = (e: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setPickedTime(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // Prevent default form submission
        setIsLoading(true)
        console.log(selectedDate)

        if (selectedDate && pickedTime) {
            const appointmentData: AppointmentData = {
                date: convertToDate(selectedDate),
                timeSlot: pickedTime,
            }
            try {
                await addAppointment(appointmentData)
                // Optionally, you can add a success message or navigate to another page here
            } catch (error) {
                console.error('Error adding appointment:', error)
                // Handle error scenario if needed
            } finally {
                setIsLoading(false)
            }
        }
    }

    const formatDate = (date: DateValue | null): string => {
        if (!date) return ''
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
            date.day
        ).padStart(2, '0')}`
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-center">Make An Appointment</h3>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
                <div>
                    <I18nProvider locale="en-US">
                        <DatePicker
                            label="Appointment Date"
                            aria-label="Appointment Date"
                            isDateUnavailable={isDateUnavailable}
                            minValue={startDate}
                            onChange={handleDateChange}
                            className="w-full mb-4"
                        />
                    </I18nProvider>
                </div>
                <div className="max-w-md mx-auto flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                        label="Time Slot"
                        placeholder="Select a time slot"
                        className="max-w-md"
                        isDisabled={!selectedDate}
                        selectedKeys={[pickedTime]}
                        onChange={handleSelectionChange}
                    >
                        {timeSlots.map((slot) => (
                            <SelectItem key={slot.key} value={slot.key}>
                                {slot.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="mt-10">
                    <div className="text-lg">
                        Date Picked:
                        <p className="p-4 text-primary rounded text-center">
                            {formatDate(selectedDate)}
                        </p>
                    </div>
                    <div className="text-lg">
                        Time Slot Picked:
                        <p className="p-4 text-primary rounded text-center">
                            {pickedTime}
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <Button isLoading={isLoading} type="submit" color="primary">
                        Add Appointment
                    </Button>
                    {/* Can not use FormButton on client component */}
                </div>
            </div>
        </form>
    )
}

export default AddAppointment
