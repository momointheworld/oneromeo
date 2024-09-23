import { DateValue } from '@internationalized/date'

function convertToUTC(
    selectedDate: DateValue,
    pickedTime: string,
    localTimeZone: string
): { utcDate: Date; utcTime: string } {
    // Combine the selected date and picked time into a single Date object
    const localDateTime = new Date(`${selectedDate}T${pickedTime}`)

    // Convert the local date and time to the specified local timezone
    const localDateTimeInTimezone = new Date(
        localDateTime.toLocaleString('en-US', { timeZone: localTimeZone })
    )

    // Convert the local date and time to UTC
    const utcDateTime = new Date(
        localDateTimeInTimezone.toLocaleString('en-US', {
            timeZone: 'UTC',
        })
    )

    const utcDate = new Date(utcDateTime.toDateString()) // Convert to Date object
    const utcTime = utcDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    return { utcDate, utcTime }
}

export { convertToUTC }
