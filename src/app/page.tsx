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
import { Button, Chip, Input } from '@nextui-org/react'
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
import parseErrors from '@/components/common/errorMessage'

const OrderForm = () => {
    interface Item {
        imgSrc: StaticImageData
        imgAlt: string
        title: string
        price: string
        priceId: string
        description: string
    }

    interface AppointmentData {
        timeZone: string
        date: Date
        thTimeSlot: string
        csrTimeSlot: string
        email: string
    }

    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const { selectedPriceId, setSelectedPriceId } = useSelectedItem()
    const [isAppointmentAvailable, setIsAppointmentAvailable] = useState(true)

    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const appointmentRef = useRef<HTMLDivElement>(null) // Create a ref for the Appointment component
    const { email, setEmail } = useEmail()
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isDateInvalid, setIsDateInvalid] = useState(false)
    const [isTimezoneInvalid, setIsTimezoneInvalid] = useState(false)
    const [isTimeSlotInvalid, setIsTimeSlotInvalid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [dateError, setDateError] = useState('')
    const [timezoneError, setTimezoneError] = useState('')
    const [timeSlotError, setTimeSlotError] = useState('')
    const [generalError, setGeneralError] = useState('')
    const [formStateMessage, setFormStateMessage] = useState('')
    const [availableSlots, setAvailableSlots] = useState(timeSlots)
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

    const items = [
        {
            imgSrc: productImg,
            imgAlt: '',
            title: 'U Talk, I Listen',
            price: 'USD 5.50',
            priceId: 'price_1PckCSHcOAKxyg1Z0WStpNJl',
            description:
                "15-minute session / Buy me a coffee and I'll be the best listener you've ever had :-)",
        },
        {
            imgSrc: productImg,
            imgAlt: '',
            title: 'U Talk, I Listen (5x)',
            price: 'USD 24.50',
            priceId: 'price_1PckCyHcOAKxyg1ZPUkOd5XO',
            description:
                'Bundle of 5 x 15-minute sessions / Buy me 5 coffees for a lower price :-)',
        },
        {
            imgSrc: productImg,
            imgAlt: '',
            title: 'Ebook',
            price: 'USD 1.25',
            priceId: 'price_1PffWVHcOAKxyg1ZcYyxKX8U',
            description:
                'I’ve been typing away for hours, days, and weeks, but it’s finally here — my debut novel is out now! Not in a Million Years!',
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

    // useEffect(() => {
    //     // Check to see if this is a redirect back from Checkout
    //     const query = new URLSearchParams(window.location.search)
    //     if (query.get('success')) {
    //         console.log('Order placed! You will receive an email confirmation.')
    //     }

    //     if (query.get('canceled')) {
    //         console.log(
    //             'Order canceled -- continue to shop around and checkout when you’re ready.'
    //         )
    //     }
    // }, [])

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
                selectedTimezone
            )
            setAvailableSlots(convertedSlots)
        }
    }, [selectedDate, appointments, selectedTimezone])

    const resetAppointment = () => {
        setSelectedTimezone(''), setSelectedDate(null), setPickedTime('')
    }

    // get the product information
    const handleItemClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const priceId = e.currentTarget.getAttribute('data-price-id')
        const item = items.find((item) => item.priceId === priceId) || null
        setSelectedItem(item)
        setSelectedPriceId(priceId)
        if (priceId === 'price_1PffWVHcOAKxyg1ZcYyxKX8U') {
            setIsAppointmentAvailable(false)
            resetAppointment()
        } else {
            setIsAppointmentAvailable(true)
        }
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
                selectedTimezone
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
            // alert('Please select an item.')
            setFormStateMessage('Please choose a coffee or ebook.')
            setIsLoading(false)
            return
        }

        try {
            // Prepare the values to be sent to the server
            const dateStr = selectedDate
                ? new Date(selectedDate.toString())
                : null
            const orderDate = selectedDate ? selectedDate.toString() : ''

            // Convert the customer time slot label to the Thai time slot label
            const thTimeSlot =
                pickedTime && dateStr && selectedTimezone
                    ? revertTimezone(pickedTime, dateStr, selectedTimezone)
                    : null
            const thLabel = thTimeSlot ? thTimeSlot.label : ''
            const label = thLabel ? `${pickedTime} (${thLabel})` : ''

            // Call the checkout function to interact with the server
            const result = await checkout(
                selectedItem.priceId,
                email,
                selectedTimezone,
                orderDate,
                label
            )

            if (result.error) {
                const errorString = result.error
                const fieldErrors = parseErrors(errorString)
                console.log(fieldErrors)
                // Display specific error messages and update state
                switch (true) {
                    case !!fieldErrors.emailError:
                        setIsEmailInvalid(true)
                        setEmailError(fieldErrors.emailError)
                        break
                    default:
                        setIsEmailInvalid(false)
                        setEmailError('')
                        break
                }

                switch (true) {
                    case !!fieldErrors.timezoneError:
                        setIsTimezoneInvalid(true)
                        setTimezoneError(fieldErrors.timezoneError)
                        break
                    default:
                        setIsTimezoneInvalid(false)
                        setTimezoneError('')
                        break
                }

                switch (true) {
                    case !!fieldErrors.dateError:
                        setIsDateInvalid(true)
                        setDateError(fieldErrors.dateError)
                        break
                    default:
                        setIsDateInvalid(false)
                        setDateError('')
                        break
                }

                switch (true) {
                    case !!fieldErrors.timeSlotError:
                        setIsTimeSlotInvalid(true)
                        setTimeSlotError(fieldErrors.timeSlotError)
                        break
                    default:
                        setIsTimeSlotInvalid(false)
                        setTimeSlotError('')
                        break
                }

                // Log the errors for debugging
                console.error('Checkout error:', result.error)
            } else if (result.url) {
                // Redirect to the checkout URL
                window.location.href = result.url
                setSelectedDate(null)
                setPickedTime('')
                setAvailableSlots(timeSlots)
            } else {
                // Handle case where result.url is not defined
                alert('Failed to get the checkout URL. Please try again.')
                setFormStateMessage('Failed to proceed with the checkout.')
            }
        } catch (error) {
            setFormStateMessage(
                'Failed to add the appointment, try again later.'
            )
            console.error('Error adding appointment:', error)
        } finally {
            setIsLoading(false)
            // Reset message after 5 seconds
            setTimeout(() => {
                setFormStateMessage('')
            }, 5000)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-20">
                <OrderItems handleItemClick={handleItemClick} items={items} />
                <div ref={appointmentRef}>
                    <div className="flex place-content-center">
                        <Chip color="primary">2 </Chip>
                        <span className="mx-5 text-2xl font-bold tracking-tight text-gray-600">
                            Choose Your Time
                        </span>
                    </div>
                    <AddAppointment
                        // handleSubmit={handleSubmit}
                        handleDateChange={handleDateChange}
                        handleTimeChange={handleTimeChange}
                        // selectedDate={selectedDate}
                        pickedTime={pickedTime}
                        newDisabledRanges={newDisabledRanges}
                        availableSlots={availableSlots}
                        formStateMessage={formStateMessage}
                        isEmailInvalid={isEmailInvalid}
                        isTimezoneInvalid={isTimezoneInvalid}
                        isDateInvalid={isDateInvalid}
                        isTimeSlotInvalid={isTimeSlotInvalid}
                        isDisabled={!isAppointmentAvailable}
                        emailError={emailError}
                        timezoneError={timezoneError}
                        timeSlotError={timeSlotError}
                        dateError={dateError}
                    />
                </div>
                <div className=" flex justify-center">
                    <Button isLoading={isLoading} type="submit" color="primary">
                        PROCEED &gt;&gt;
                    </Button>
                    {/* Can not use FormButton on client component */}
                </div>
            </form>
        </div>
    )
}

export default OrderForm
