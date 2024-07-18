import {
    formatInTimeZone,
    format,
    toZonedTime,
    fromZonedTime,
} from 'date-fns-tz'

interface TimeSlot {
    key: string
    start: string
    end: string
    period: string
    label: string
}

const timeSlots: TimeSlot[] = [
    {
        key: '10:30 AM - 10:45 AM',
        start: '10:30',
        end: '10:45',
        period: 'AM',
        label: '10:30 AM - 10:45 AM', // Default label, can be updated after conversion
    },
    {
        key: '0530 PM - 0545 PM',
        start: '05:30',
        end: '05:45',
        period: 'PM',
        label: '05:30 PM - 05:45 PM', // Default label, can be updated after conversion
    },
    {
        key: '09:30 PM - 09:45 PM',
        start: '09:30',
        end: '09:45',
        period: 'PM',
        label: '09:30 PM - 09:45 PM', // Default label, can be updated after conversion
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
            startHour + (period === 'PM' && startHour !== 12 ? 12 : 0),
            startMinute,
            0
        )

        let endDateTime = new Date(selectedDate)
        endDateTime.setHours(
            endHour + (period === 'PM' && endHour !== 12 ? 12 : 0),
            endMinute,
            0
        )

        // Utility function to get the offset in hours for a given timezone
        const getTimezoneOffsetInHours = (date: Date, timezone: string) => {
            const zonedDate = toZonedTime(date, timezone)
            const utcDate = fromZonedTime(zonedDate, timezone)
            return (zonedDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
        }

        // Utility function to format time and handle the special case for 12:xxam
        const formatTimeLabel = (date: Date, timezone: string) => {
            let formattedTime = formatInTimeZone(date, timezone, 'hh:mm a')
            if (
                formattedTime.startsWith('12:') &&
                formattedTime.endsWith('AM')
            ) {
                formattedTime = '00' + formattedTime.slice(2)
            }
            return formattedTime
        }

        // Convert to the selected timezone and format the time labels
        const localStartFormatted = formatTimeLabel(
            startDateTime,
            selectedTimezone
        )
        const localEndFormatted = formatTimeLabel(endDateTime, selectedTimezone)

        // Get timezone offsets
        const bangkokOffset = getTimezoneOffsetInHours(
            startDateTime,
            'Asia/Bangkok'
        )
        const startOffset = getTimezoneOffsetInHours(
            startDateTime,
            selectedTimezone
        )

        // Calculate the difference
        const offsetDifference = bangkokOffset - startOffset

        // Prepare the labels with the necessary suffix
        let localStartLabel = localStartFormatted
        let localEndLabel = localEndFormatted

        if (offsetDifference >= 10 && localStartLabel.includes('PM')) {
            localEndLabel += ' -1'
        } else if (offsetDifference < -1 && localStartLabel.includes('AM')) {
            localEndLabel += ' +1'
        }

        const label = `${localStartLabel} - ${localEndLabel}`
        return {
            ...slot,
            start: localStartFormatted.split(' ')[0], // Update start time
            end: localEndFormatted.split(' ')[0], // Update end time
            label,
        }
    })
}

export { convertToUserTimezone, timeSlots }
