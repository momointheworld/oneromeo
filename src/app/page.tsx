'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
    today,
    DateValue,
    CalendarDate,
    ZonedDateTime,
    toCalendarDate,
    parseAbsolute,
    GregorianCalendar,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { getAppointments } from '@/actions'
import AddAppointment from '@/components/appointment'
import { Button, Card, Chip, Input } from '@nextui-org/react'
import {
    convertToUserTimezone,
    generateTimeSlots,
} from '@/utils/converTimeZone'
import { useTimezone } from '@/hooks/useTimezone'
import { useDate } from '@/hooks/useDate'
import OrderItems from '@/components/orderItems'
import singleSessionImg from '/public/single-session.png'
import ebookImg from '/public/ebook-2.png'
import bundleImg from '/public/bundle-sessions.png'
import { useEmail } from '@/hooks/useEmail'
import { useSelectedItem } from '@/hooks/useSelectedItem'
import checkout from '@/actions/checkout'
import { StaticImageData } from 'next/image'

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
    const singleSessionPriceId = process.env.NEXT_PUBLIC_SINGLE_SESSION_PRICEID
    const bundlePriceId = process.env.NEXT_PUBLIC_BUNDLE_PRICEID
    const ebookPriceId = process.env.NEXT_PUBLIC_EBOOK_PRICEID

    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const { selectedPriceId, setSelectedPriceId } = useSelectedItem()
    const [singleSession, setSingleSession] = useState(false)
    const [isAppointmentAvailable, setIsAppointmentAvailable] = useState(true)
    const [secondStepTitle, setSecondStepTitle] = useState(
        'Choose Time & Email'
    )

    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    let endDate = now.add({ days: 30 }) // Two weeks from tomorrow
    const appointmentRef = useRef<HTMLDivElement>(null) // Create a ref for the Appointment component
    const { email, setEmail } = useEmail()
    const [couponCode, setCouponCode] = useState('')
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isDateInvalid, setIsDateInvalid] = useState(false)
    const [isTimeSlotInvalid, setIsTimeSlotInvalid] = useState(false)
    const [isCouponInvalid, setIsCouponInvalid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [dateError, setDateError] = useState('')
    const [timeSlotError, setTimeSlotError] = useState('')
    const [couponCodeError, setCouponCodeError] = useState('')
    const [formStateMessage, setFormStateMessage] = useState('')
    const [showNote, setShowNote] = useState(false)
    const [note, setNote] = useState('')
    // const [availableSlots, setAvailableSlots] = useState(timeSlots)
    // const { selectedTimezone, setSelectedTimezone } = useTimezone()
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
            imgSrc: singleSessionImg,
            imgAlt: '',
            title: 'U Talk, I Listen',
            price: 'USD 5.50',
            priceId: 'price_1PckCSHcOAKxyg1Z0WStpNJl',
            description:
                "15-minute session / Buy me a coffee and I'll be the best listener you've ever had :-)",
        },
        {
            imgSrc: bundleImg,
            imgAlt: '',
            title: 'U Talk, I Listen (5x)',
            price: 'USD 24.50',
            priceId: 'price_1PckCyHcOAKxyg1ZPUkOd5XO',
            description:
                'Bundle of 5 x 15-minute sessions / Buy me 5 coffees for a lower price :-)',
        },
        {
            imgSrc: ebookImg,
            imgAlt: '',
            title: 'eBook',
            price: 'USD 1.25',
            priceId: 'price_1PffWVHcOAKxyg1ZcYyxKX8U',
            description:
                'I’ve been typing away for hours, days, and weeks, but it‘s finally here - Not in a Million Years!',
        },
    ]

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                setAppointments(data)

                // Get all dates from the appointments
                const dateSlotsMap = new Map()

                data.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.date)

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

                const unavailableDates: Date[] = [] // Use Date or string instead of ZonedDateTime
                dateSlotsMap.forEach((slots, date) => {
                    if (slots.length === 2) {
                        unavailableDates.push(new Date(date)) // Just push the date without conversion
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

                console.log(dateSlotsMap)
                console.log(calendarDates)

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
    }, [selectedDate, appointments])

    const resetAppointment = () => {
        setSelectedDate(null), setPickedTime('')
    }
    // get the product information
    const handleItemClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const priceId = e.currentTarget.getAttribute('data-price-id')
        const item = items.find((item) => item.priceId === priceId) || null
        setSelectedItem(item)
        setSelectedPriceId(priceId)
        setShowNote(false)

        // Set `singleSession` to true if the priceId matches `singleSessionPriceId`
        if (priceId === singleSessionPriceId) {
            setSingleSession(true)
        } else {
            setSingleSession(false)
        }

        if (priceId === ebookPriceId) {
            setIsAppointmentAvailable(false)
            resetAppointment()
            setSecondStepTitle('Enter Your Email')
        } else {
            setSecondStepTitle('Choose Time & Email')
            setIsAppointmentAvailable(true)
        }

        if (priceId === bundlePriceId) {
            setShowNote(true)
            setNote(
                'At this stage, you can only schedule your first appointment.'
            )
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

        if (!selectedItem) {
            // alert('Please select an item.')
            setFormStateMessage(
                'You need to select a service or product first!'
            )
            setIsLoading(false)
            return
        }

        try {
            const localTimezone =
                Intl.DateTimeFormat().resolvedOptions().timeZone
            // convert to the local time zone
            const dateString = selectedDate?.toDate(localTimezone)
            // const orderDate = dateString ? dateString.toDateString() : ''
            const orderDate = dateString
                ? new Date(dateString).toISOString() // Convert to UTC ISO String
                : ''

            let updatedTimeSlots = dateString
                ? convertToUserTimezone(timeSlots, dateString)
                : []
            let thTimeSlot =
                pickedTime && dateString
                    ? updatedTimeSlots.find((slot) => slot.label === pickedTime)
                    : null

            // label is updated while key is unchanged
            const thLabel = thTimeSlot ? thTimeSlot.key : ''
            const label = thLabel ? `${pickedTime} (${thLabel})` : ''

            // Call the checkout function to interact with the server
            const result = await checkout(
                selectedItem.priceId,
                email,
                localTimezone,
                orderDate,
                label,
                couponCode || '' // Default to empty string if coupon is undefined
            )

            if (result.error) {
                //Split the error string to separate ones.
                const errors = result.error.split(' | ')

                // Process errors and update state accordingly
                errors.forEach((error) => {
                    if (error.startsWith('Email Error:')) {
                        setIsEmailInvalid(true)
                        setEmailError(error.replace('Email Error: ', ''))
                    }
                    if (error.startsWith('Date Error:')) {
                        setIsDateInvalid(true)
                        setDateError(error.replace('Date Error: ', ''))
                    }
                    if (error.startsWith('Time Slot Error:')) {
                        setIsTimeSlotInvalid(true)
                        setTimeSlotError(error.replace('Time Slot Error: ', ''))
                    }
                    if (error.startsWith('Coupon Code Error:')) {
                        setIsCouponInvalid(true)
                        setCouponCodeError(
                            error.replace('Coupon Code Error: ', '')
                        )
                    }
                })

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
            setFormStateMessage('Something went wrong, contact support please.')
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
        <>
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-y-16"
                >
                    <OrderItems
                        handleItemClick={handleItemClick}
                        items={items}
                    />
                    <div ref={appointmentRef}>
                        <div className="flex place-content-center mb-12">
                            <Chip color="primary" size="lg" radius="full">
                                2{' '}
                            </Chip>
                            <span className="mx-5 text-2xl font-bold tracking-tight text-gray-600">
                                {/* Choose Your Time (& enter your email) */}
                                {secondStepTitle}
                            </span>
                        </div>
                        <AddAppointment
                            handleDateChange={handleDateChange}
                            handleTimeChange={handleTimeChange}
                            pickedTime={pickedTime}
                            newDisabledRanges={newDisabledRanges}
                            availableSlots={availableSlots}
                            formStateMessage={formStateMessage}
                            isEmailInvalid={isEmailInvalid}
                            // isTimezoneInvalid={isTimezoneInvalid}
                            isDateInvalid={isDateInvalid}
                            isTimeSlotInvalid={isTimeSlotInvalid}
                            isDisabled={!isAppointmentAvailable}
                            emailError={emailError}
                            // timezoneError={timezoneError}
                            timeSlotError={timeSlotError}
                            dateError={dateError}
                        />
                        {showNote && (
                            <div className="flex justify-center mt-2 ">
                                <Card
                                    isBlurred
                                    className="text-pretty text-center bg-blue-100 p-2"
                                >
                                    {note}
                                </Card>
                            </div>
                        )}
                        {singleSession && (
                            <div className="max-w-sm mx-auto rounded-lg p-6">
                                <Input
                                    type="text"
                                    aria-label="Coupon code" // Provide aria-label for accessibility
                                    placeholder="Coupon code"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                    isInvalid={isCouponInvalid}
                                    errorMessage={couponCodeError}
                                />
                            </div>
                        )}
                    </div>
                    <div className=" flex justify-center">
                        <Button
                            isLoading={isLoading}
                            type="submit"
                            color="primary"
                        >
                            PROCEED &gt;&gt;
                        </Button>
                        {/* Can not use FormButton on client component */}
                    </div>
                </form>
            </div>
        </>
    )
}

export default OrderForm
