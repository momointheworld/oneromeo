import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

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
        key: '05:30 PM - 05:45 PM',
        start: '05:30',
        end: '05:45',
        period: 'PM',
        label: '05:30 PM - 05:45 PM', // Default label, can be updated after conversion
    },
]

const convertToUserTimezone = (
    timeSlots: TimeSlot[],
    selectedDate: Date
): TimeSlot[] => {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const thaiTimezone = 'Asia/Bangkok' // Bangkok time (UTC+7)

    return timeSlots.map((slot) => {
        const { start, end, period } = slot

        // Combine date and time for start and end in Thai time (UTC+7)
        const startTimeThai = new Date(
            `${selectedDate.toDateString()} ${start} ${period} GMT+0700`
        )
        const endTimeThai = new Date(
            `${selectedDate.toDateString()} ${end} ${period} GMT+0700`
        )

        // Convert Thai times to the local timezone
        const localStartTime = toZonedTime(startTimeThai, localTimezone)
        const localEndTime = toZonedTime(endTimeThai, localTimezone)

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

        // Format the times for the local timezone
        const localStartFormatted = formatTimeLabel(
            localStartTime,
            localTimezone
        )
        const localEndFormatted = formatTimeLabel(localEndTime, localTimezone)

        // Utility function to convert time label to hours
        const parseTimeLabel = (label: string) => {
            const [time, period] = label.split(' ')
            const [hours, minutes] = time.split(':').map(Number)
            const totalHours =
                period === 'PM' && hours !== 12 ? hours + 12 : hours
            return totalHours + minutes / 60
        }

        // Parse time labels to get hour values
        const thaiStartHours = parseTimeLabel(`${start} ${period}`)
        const localStartHours = parseTimeLabel(localStartFormatted)
        const offsetHours = thaiStartHours - localStartHours

        // Add tags based on the time difference
        let localEndLabel = localEndFormatted

        // Extract AM/PM designation
        const thaiPeriod = period // Thai AM/PM
        const localPeriod = localStartFormatted.split(' ')[1] // Local AM/PM
        // Hours difference between Thai and some timezone
        const excludedOffsets = [-2, -3, -4, -5]
        // [1230pm, 1330pm, 1430pm, 1530pm]

        // Only append "-1" if the time changes from AM to PM and the hours difference not in the array
        if (
            !excludedOffsets.includes(offsetHours) &&
            thaiPeriod === 'AM' &&
            localPeriod === 'PM'
        ) {
            localEndLabel += ' -1'
        }

        // Create the new label based on the local timezone with the tag if necessary
        const label = `${localStartFormatted} - ${localEndLabel}`
        return {
            ...slot,
            start: localStartFormatted.split(' ')[0], // Update start time
            end: localEndFormatted.split(' ')[0], // Update end time
            label,
        }
    })
}

export { convertToUserTimezone, timeSlots }
