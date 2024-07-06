import { formatInTimeZone, format, toZonedTime } from 'date-fns-tz'

interface TimeSlot {
    key: string
    start: string
    end: string
    period: string
    label: string
}

const timeSlots: TimeSlot[] = [
    {
        key: '1030 - 1045 am',
        start: '10:30',
        end: '10:45',
        period: 'am',
        label: '1030 - 1045 am', // Default label, can be updated after conversion
    },
    {
        key: '0530 - 0545 pm',
        start: '05:30',
        end: '05:45',
        period: 'pm',
        label: '530 - 545 pm', // Default label, can be updated after conversion
    },
    {
        key: '0930 - 0945 pm',
        start: '09:30',
        end: '09:45',
        period: 'pm',
        label: '930 - 945 pm', // Default label, can be updated after conversion
    },
]

const convertToUserTimezone = (
    timeSlots: TimeSlot[],
    selectedDate: Date,
    selectedTimezone: string // New parameter for selected timezone
): TimeSlot[] => {
    return timeSlots.map((slot) => {
        const { start, end, period } = slot
        const [startHour, startMinute] = start.split(':').map(Number)
        const [endHour, endMinute] = end.split(':').map(Number)
        let tag = '-1'

        // Initialize startDateTime and endDateTime
        let startDateTime = new Date(selectedDate)

        startDateTime.setHours(
            startHour + (period === 'pm' && startHour !== 12 ? 12 : 0),
            startMinute,
            0
        )

        let endDateTime = new Date(selectedDate)
        endDateTime.setHours(
            endHour + (period === 'pm' && endHour !== 12 ? 12 : 0),
            endMinute,
            0
        )

        const localStartFormatted = formatInTimeZone(
            startDateTime,
            selectedTimezone, // Use selected timezone here
            'hh:mm a'
        )
        const localEndFormatted = formatInTimeZone(
            endDateTime,
            selectedTimezone, // Use selected timezone here
            'hh:mm a'
        )
        // / Adjust label if local start time is in PM period
        const isPM = localStartFormatted.toLowerCase().includes('pm')
        const label = `${localStartFormatted} - ${localEndFormatted}${
            isPM ? ' -1' : ''
        }`

        return {
            ...slot,
            start: localStartFormatted.split(' ')[0], // Update start time
            end: localEndFormatted.split(' ')[0], // Update end time
            label,
        }
    })
}

export { convertToUserTimezone, timeSlots }
