import { format, toZonedTime } from 'date-fns-tz'
import { addDays, isTuesday, isFriday } from 'date-fns'

interface TimeSlot {
    time: string
    date: Date
}

const predefinedTimes = ['02:30', '14:30'] // Predefined UTC times

// Function to get the next Tuesday or Friday based on UTC
const getNextTuesdayOrFridayUTC = (startDate: Date) => {
    let currentDate = new Date(startDate.toISOString()) // Ensure currentDate is in UTC
    const tuesdaysAndFridays: Date[] = []

    // Loop through the next 30 days
    for (let i = 0; i < 30; i++) {
        const utcDay = currentDate.getUTCDay() // Get the day of the week in UTC (0 = Sunday, 1 = Monday, etc.)

        // Check if it's a Tuesday (2) or Friday (5) in UTC
        if (utcDay === 2 || utcDay === 5) {
            tuesdaysAndFridays.push(new Date(currentDate)) // Push the UTC date
        }

        // Move to the next day in UTC
        currentDate = addDays(currentDate, 1)
    }
    return tuesdaysAndFridays
}

// Generate timeslots for the upcoming Tuesdays and Fridays
const generateTimeSlots = () => {
    const startDate = new Date() // Start from today's date
    const dates = getNextTuesdayOrFridayUTC(startDate)
    const timeSlots: TimeSlot[] = []

    dates.forEach((date) => {
        predefinedTimes.forEach((time) => {
            // Add each time slot for the specific date
            timeSlots.push({
                time, // Use the predefined UTC time
                date, // Use the computed Tuesday/Friday date
            })
        })
    })

    return timeSlots
}

// Get the user's timezone
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

// Convert the UTC timeslots to the user's local timezone
const convertToUserTimezone = (slots: { time: string; date: Date }[]) => {
    return slots.map((slot) => {
        // Combine date and time into a UTC date-time string
        const utcDate = new Date(
            `${slot.date.toISOString().split('T')[0]}T${slot.time}:00Z`
        )

        // Convert UTC datetime to user's local timezone
        const localDate = toZonedTime(utcDate, userTimeZone)

        // Format the time in the user's local timezone
        const formattedTime = format(localDate, 'HH:mm', {
            timeZone: userTimeZone,
        })

        return {
            ...slot,
            time: formattedTime,
            date: localDate,
        }
    })
}

// Generate and export time slots for the coming Tuesdays and Fridays
const timeSlots = generateTimeSlots()

export { convertToUserTimezone, timeSlots }
