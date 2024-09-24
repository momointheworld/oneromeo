import { DateTime } from 'luxon'

const combineDateAndTimeInZone = (
    date: Date,
    time: string,
    timeZone: string
): string => {
    const [hours, minutes] = time.split(':').map(Number)

    // Convert the JavaScript Date object to a Luxon DateTime object
    const dateTime = DateTime.fromJSDate(date).setZone(timeZone, {
        keepLocalTime: true,
    })

    // Set the time using hours and minutes
    const combinedDateTime = dateTime.set({ hour: hours, minute: minutes })

    // Return the ISO string with time zone information or throw an error if it fails
    const isoString = combinedDateTime.toISO()
    if (!isoString) {
        throw new Error(`Invalid date/time conversion for ${timeZone}`)
    }

    return isoString
}

export { combineDateAndTimeInZone }
