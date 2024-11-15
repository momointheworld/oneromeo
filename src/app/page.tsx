'use client'
import React, { useRef, useState } from 'react'
import { today, DateValue, getLocalTimeZone } from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import AddAppointment from '@/components/appointment'
import { Button, Card, Chip, Input } from '@nextui-org/react'
import { useDate } from '@/hooks/useDate'
import OrderItems from '@/components/orderItems'
import singleSessionImg from '/public/single-session.png'
import ebookImg from '/public/ebook.png'
import bundleImg from '/public/bundle-sessions.png'
import { useEmail } from '@/hooks/useEmail'
import { useSelectedItem } from '@/hooks/useSelectedItem'
import checkout from '@/actions/checkout'
import { StaticImageData } from 'next/image'
import { DateTime } from 'luxon'

const OrderForm = () => {
    interface Item {
        imgSrc: StaticImageData
        imgAlt: string
        title: string
        price: string
        priceId: string
        description: string
    }

    const singleSessionPriceId = process.env.NEXT_PUBLIC_SINGLE_SESSION_PRICEID
    const bundlePriceId = process.env.NEXT_PUBLIC_BUNDLE_PRICEID
    const ebookPriceId = process.env.NEXT_PUBLIC_EBOOK_PRICEID

    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const { selectedPriceId, setSelectedPriceId } = useSelectedItem()
    const [singleSession, setSingleSession] = useState(false)
    const [isAppointmentAvailable, setIsAppointmentAvailable] = useState(true)
    const [secondStepTitle, setSecondStepTitle] = useState(
        'Select a time (& email) to get going!'
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
    const { selectedDate, setSelectedDate } = useDate()
    const [pickedTime, setPickedTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const items = [
        {
            imgSrc: singleSessionImg,
            imgAlt: '',
            title: 'U Talk, I Listen',
            price: 'HK$45',
            priceId: singleSessionPriceId || '',
            description:
                "15-minute session / Buy me a coffee and I'll be the best listener you've ever had :-)",
        },
        {
            imgSrc: bundleImg,
            imgAlt: '',
            title: 'U Talk, I Listen (5x)',
            price: 'HK$200',
            priceId: bundlePriceId || '',
            description:
                'Bundle of 5 x 15-minute sessions / Buy me 5 coffees for a lower price :-)',
        },
        {
            imgSrc: ebookImg,
            imgAlt: '',
            title: 'eBook',
            price: 'HK$10',
            priceId: ebookPriceId || '',
            description:
                'I’ve been typing away for hours, days, and weeks, but it‘s finally here - Not in a Million Years!',
        },
    ]

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
            setSecondStepTitle('Your email, please, to get you going!')
        } else {
            setSecondStepTitle('Select a time (& email) to get going!')
            setIsAppointmentAvailable(true)
        }

        if (priceId === bundlePriceId) {
            setShowNote(true)
            setNote('For now, just schedule your first appointment.')
        }

        // Scroll to the Appointment component
        if (appointmentRef.current) {
            appointmentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    // Function to handle date change
    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        // checkTimeSlots(date)
        setPickedTime('')
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
        } else if (isAppointmentAvailable && !selectedDate) {
            setIsDateInvalid(true)
            setDateError('Please choose a date')
            setIsLoading(false)
            return
        }

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let combinedCsrDate: string | null = null

        if (selectedDate && pickedTime) {
            // Create the date in local time first
            const dt = DateTime.local(
                selectedDate.year,
                selectedDate.month,
                selectedDate.day,
                parseInt(pickedTime.split(':')[0]),
                parseInt(pickedTime.split(':')[1]),
                0,
                { zone: userTimeZone } // Explicitly set the zone
            )

            if (!dt.isValid) {
                throw new Error('Invalid datetime conversion')
            }

            combinedCsrDate = dt.toISO()

            // Debug logging
            console.log('Date debugging:', {
                selectedDate: {
                    year: selectedDate.year,
                    month: selectedDate.month,
                    day: selectedDate.day,
                },
                pickedTime,
                userTimeZone,
                luxonDate: dt.toString(),
                isoString: combinedCsrDate,
                zoneName: dt.zoneName,
                offset: dt.offset,
                isValid: dt.isValid,
            })
        }

        try {
            // Call the checkout function to interact with the server
            const result = await checkout(
                selectedItem.priceId,
                email,
                userTimeZone,
                combinedCsrDate || '',
                pickedTime,
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
                // setAvailableSlots(timeSlots)
            } else {
                // Handle case where result.url is not defined
                alert('Failed to get the checkout URL. Please try again.')
                setFormStateMessage('Unable to proceed with the checkout')
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
                        <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-0 mb-12 custom-font flex-wrap">
                            <Chip color="primary" size="lg" radius="full">
                                2{' '}
                            </Chip>
                            <span className="mx-5 text-2xl font-bold tracking-tight text-gray-600">
                                {secondStepTitle}
                            </span>
                        </div>
                        <AddAppointment
                            handleDateChange={handleDateChange}
                            handleTimeChange={handleTimeChange}
                            pickedTime={pickedTime}
                            formStateMessage={formStateMessage}
                            isEmailInvalid={isEmailInvalid}
                            isDateInvalid={isDateInvalid}
                            isTimeSlotInvalid={isTimeSlotInvalid}
                            isDisabled={!isAppointmentAvailable}
                            emailError={emailError}
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
                    <div className=" flex justify-center custom-font">
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
