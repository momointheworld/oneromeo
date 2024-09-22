import { DateValue } from '@internationalized/date'

function convertToThaiDateTime(
    selectedDate: DateValue,
    pickedTime: string,
    localTimeZone: string
): { thaiDate: Date; thaiTime: string } {
    // Combine the selected date and picked time into a single Date object
    const localDateTime = new Date(`${selectedDate}T${pickedTime}`)

    // Convert the local date and time to the specified local timezone
    const localDateTimeInTimezone = new Date(
        localDateTime.toLocaleString('en-US', { timeZone: localTimeZone })
    )

    // Convert the local date and time to Thai timezone (Asia/Bangkok)
    const thaiDateTime = new Date(
        localDateTimeInTimezone.toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
        })
    )

    const thaiDate = new Date(thaiDateTime.toDateString()) // Convert to Date object
    const thaiTime = thaiDateTime.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
    })
    return { thaiDate, thaiTime }
}

export { convertToThaiDateTime }
