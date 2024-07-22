'use client'
import React, { ReactHTMLElement, useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
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
import { addAppointment, getAppointments } from '@/actions'
import AddAppointment from '@/components/appointment'
import { Button, Input } from '@nextui-org/react'
import { convertToUserTimezone, timeSlots } from '@/utils/converTimeZone'
import { useTimezone } from '@/hooks/useTimezone'
import { useDate } from '@/hooks/useDate'
import OrderItems from '@/components/orderItems'
import productImg from '/public/logo.png'
import { StaticImageData } from 'next/image'
import { useEmail } from '@/hooks/useEmail'
import { useSelectedItem } from '@/hooks/useSelectedItem'
import checkout from '@/actions/checkout'
import { revertTimezone } from '@/utils/revertTimeZone'

const OrderForm = () => {
    interface Item {
        imgSrc: StaticImageData
        imgAlt: string
        title: string
        price: string
        priceId: string
        description: string
    }

    // interface CustomDateValue {
    //     year: number
    //     month: number
    //     day: number
    //     era: string
    //     calendar: { identifier: string }
    // }

    interface AppointmentData {
        timeZone: string
        date: Date
        thTimeSlot: string
        csrTimeSlot: string
        email: string
    }

    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const { selectedPriceId, setSelectedPriceId } = useSelectedItem()

    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const appointmentRef = useRef<HTMLDivElement>(null) // Create a ref for the Appointment component
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

    const items = [
        {
            imgSrc: productImg,
            imgAlt: '',
            title: 'U Talk, I Listen',
            price: 'HKD30',
            priceId: 'price_1PckCSHcOAKxyg1Z0WStpNJl',
            description: '15 min per session.',
        },
        {
            imgSrc: productImg,
            imgAlt: '',
            title: 'Bundle of 5',
            price: 'HKD125',
            priceId: 'price_1PckCyHcOAKxyg1ZPUkOd5XO',
            description: '15 min per session.',
        },
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

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search)
        if (query.get('success')) {
            console.log('Order placed! You will receive an email confirmation.')
        }

        if (query.get('canceled')) {
            console.log(
                'Order canceled -- continue to shop around and checkout when you’re ready.'
            )
        }
    }, [])

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

    // get the product information
    const handleItemClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const priceId = e.currentTarget.getAttribute('data-price-id')
        const item = items.find((item) => item.priceId === priceId) || null
        setSelectedItem(item)
        setSelectedPriceId(priceId)
        // Scroll to the Appointment component
        if (appointmentRef.current) {
            appointmentRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

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
        if (!selectedItem) {
            alert('Please select an item.')
            setIsLoading(false)
            return
        } else if (!selectedDate) {
            alert('Please select a date.')
            setIsLoading(false)
            return
        } else if (!pickedTime) {
            alert('Please select a time slot.')
            setIsLoading(false)
            return
        }
        if (selectedDate && pickedTime && selectedTimeZone) {
            const dateStr = new Date(selectedDate.toString())
            const orderDate = selectedDate.toString()
            //convert the customer time slot label to the Thai time slot label
            const thTimeSlot = revertTimezone(
                pickedTime,
                dateStr,
                selectedTimeZone
            )
            if (!thTimeSlot) {
                return
            }
            const thLabel = thTimeSlot?.label

            try {
                await checkout(
                    selectedItem.priceId,
                    email,
                    selectedTimeZone,
                    orderDate,
                    `${thLabel};${pickedTime}`
                )
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
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-20">
                <OrderItems handleItemClick={handleItemClick} items={items} />
                <div ref={appointmentRef}>
                    <AddAppointment
                        // handleSubmit={handleSubmit}
                        handleDateChange={handleDateChange}
                        handleTimeChange={handleTimeChange}
                        // selectedDate={selectedDate}
                        pickedTime={pickedTime}
                        newDisabledRanges={newDisabledRanges}
                        availableSlots={availableSlots}
                        formStateMessage={formStateMessage}
                    />
                </div>
                <div className=" flex justify-center">
                    <Button isLoading={isLoading} type="submit" color="primary">
                        Checkout
                    </Button>
                    {/* Can not use FormButton on client component */}
                </div>
            </form>
        </div>
    )
}

export default OrderForm
