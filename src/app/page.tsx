'use client'
import React, { Children, useEffect, useState } from 'react'
import {
    today,
    DateValue,
    CalendarDate,
    toCalendarDate,
    parseAbsolute,
    parseAbsoluteToLocal,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { getAppointments } from '@/actions'
import AddAppointment from '@/components/appointment'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import { convertToUserTimezone, timeSlots } from '@/components/converTimeZone'
import { useTimezone } from '@/components/useTimezone'

interface ItemsProps {
    children: React.ReactNode
}

const Items: React.FC<ItemsProps> = ({ children }) => {
    const list = [
        {
            img: '',
            title: 'U Talk, I Listen (15 min)',
            text: 'U Talk, I Listen (15 min)',
            price: '$5.50',
            priceId: 'price_1PYkSdAlyXyK8wMusaHnNPOd',
        },
        {
            img: '',
            title: 'Bundle of 5',
            text: 'Bundle of 5',
            price: '$24.50',
            priceId: 'price_1PYkTeAlyXyK8wMuzwGlWK1F',
        },
    ]

    return (
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {list.map((item, index) => (
                <Card
                    shadow="sm"
                    key={index}
                    isPressable
                    onPress={() => console.log('item pressed')}
                >
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt={item.title}
                            className="w-full object-cover h-[140px]"
                            src={item.img}
                        />
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                        <b>{item.title}</b>
                        <p className="text-default-500">{item.price}</p>
                    </CardFooter>
                </Card>
            ))}

            {children}
        </div>
    )
}

const OrderForm = () => {
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

    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow

    const [formStateMessage, setFormStateMessage] = useState('')
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)
    const [availableSlots, setAvailableSlots] = useState(timeSlots)
    const { selectedTimeZone, setSelectedTimeZone } = useTimezone()
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

                // // Convert unavailableDates to ZonedDateTime
                // const zonedDateTimeDates = unavailableDates.map((date) =>
                //     parseAbsoluteToLocal(date.toISOString())
                // )
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

    // Function to handle date change
    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        checkTimeSlots(date)
        setPickedTime('')

        if (date) {
            const dateObj = new Date(date.year, date.month - 1, date.day)
            const convertedSlots = convertToUserTimezone(
                timeSlots,
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
        console.log('Selected Date: ', { selectedDate }, 'selected slot', {
            pickedTime,
        })
    }

    return (
        <>
            <Items>
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
            </Items>
        </>
    )
}

export default OrderForm
