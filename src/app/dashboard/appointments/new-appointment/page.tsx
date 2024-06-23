'use client'
import React, { useState } from 'react'
import { Button, DatePicker, DateValue } from '@nextui-org/react'
import { addAppointment } from '@/actions/addappointment'

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
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)
    const [pickedTime, setPickedTime] = useState<string>('')

    const handleDateChange = (date: DateValue | null) => {
        setSelectedDate(date)
        setPickedTime('') // Reset time slot when date changes
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPickedTime(event.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // Prevent default form submission

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
            }
        }
    }

    const formatDate = (date: DateValue | null): string => {
        if (!date) return 'None'
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
            date.day
        ).padStart(2, '0')}`
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
                <div>
                    <DatePicker
                        label="Appointment date"
                        aria-label="Appointment date"
                        onChange={handleDateChange}
                        className="w-full mb-4"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="time-slot"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Time Slot
                    </label>
                    <select
                        id="time-slot"
                        value={pickedTime}
                        onChange={handleTimeChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={!selectedDate}
                    >
                        <option value="" disabled>
                            Select a time slot
                        </option>
                        <option value="10am-11am">10am-11am</option>
                        <option value="3pm-4pm">3pm-4pm</option>
                    </select>
                </div>
                <div className="mt-10 text-center">
                    <p className="text-sm">
                        Picked Date:
                        <span className="p-4 bg-warning-100 rounded-lg shadow-md">
                            {formatDate(selectedDate)}
                        </span>
                    </p>
                    <p className="text-sm">
                        Picked Time:
                        <span className="p-4 bg-warning-100 rounded-lg shadow-md">
                            {pickedTime}
                        </span>
                    </p>
                </div>
                <div className="mt-6">
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm"
                    >
                        Add Appointment
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default AddAppointment
