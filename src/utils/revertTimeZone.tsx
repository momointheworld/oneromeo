import { formatInTimeZone } from 'date-fns-tz'

const revertTimeZone = (
    timeSlot: string,
    selectedTimezone: string // Parameter for the selected timezone of the time slot
): string => {
    // Split the time slot into start and end times
    const [startTime, endTime] = timeSlot.split(' - ')

    // Parse the start and end times
    const [startHour, startMinute, startPeriod] = parseTime(startTime)
    const [endHour, endMinute, endPeriod] = parseTime(endTime)

    // Create Date objects for start and end times
    const startDate = new Date()
    startDate.setHours(
        startHour + (startPeriod === 'PM' && startHour !== 12 ? 12 : 0),
        startMinute,
        0
    )

    const endDate = new Date()
    endDate.setHours(
        endHour + (endPeriod === 'PM' && endHour !== 12 ? 12 : 0),
        endMinute,
        0
    )

    // Convert start and end times to Bangkok time
    const bangkokStartTime = formatInTimeZone(
        startDate,
        selectedTimezone,
        'HH:mm'
    )
    const bangkokEndTime = formatInTimeZone(endDate, selectedTimezone, 'HH:mm')

    // Format the result
    return `${bangkokStartTime} - ${bangkokEndTime}`
}

// Helper function to parse time string in "hh:mm AM/PM" format
const parseTime = (timeString: string): [number, number, string] => {
    const [timePart, period] = timeString.split(' ')
    const [hourStr, minuteStr] = timePart.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)

    return [hour, minute, period]
}

export { revertTimeZone }
