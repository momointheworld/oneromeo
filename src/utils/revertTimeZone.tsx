// import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

// interface TimeSlot {
//     key: string
//     start: string
//     end: string
//     period: string
//     label: string
// }

// const parseTimeSlotString = (timeSlotStr: string): TimeSlot => {
//     // Split the string by the ' - ' delimiter
//     const parts = timeSlotStr.split(' - ')

//     // Extract the start and end times
//     const startStr = parts[0]
//     let endStrWithPeriod = parts[1]
//     // Check if there's an additional marker like '-1' at the end
//     let additionalMarker = ''
//     if (parts.length > 2) {
//         additionalMarker = parts.slice(2).join(' - ')
//     }

//     // Extract the period from the end time
//     let period = ''
//     if (endStrWithPeriod.includes(' - ')) {
//         ;[endStrWithPeriod, period] = endStrWithPeriod.split(' - ')
//     }

//     const [start, startPeriod] = startStr.split(' ')
//     const [end, endPeriod] = endStrWithPeriod.split(' ')

//     return {
//         key: timeSlotStr,
//         start,
//         end,
//         period: startPeriod,
//         label: timeSlotStr,
//     }
// }

// const revertTimezone = (
//     timeSlotStr: string,
//     selectedDate: Date,
//     selectedTimezone: string
// ): TimeSlot | null => {
//     const timeSlot = parseTimeSlotString(timeSlotStr)
//     if (!timeSlot) {
//         return null
//     }

//     const { start, end, period } = timeSlot
//     const [startHour, startMinute] = start.split(':').map(Number)
//     const [endHour, endMinute] = end.split(':').map(Number)

//     const constructDateWithTime = (
//         hour: number,
//         minute: number,
//         period: string,
//         date: Date
//     ): Date => {
//         let time = new Date(date)
//         time.setHours(
//             hour +
//                 (period === 'PM' && hour !== 12 ? 12 : 0) -
//                 (period === 'AM' && hour === 12 ? 12 : 0),
//             minute,
//             0,
//             0
//         )
//         return time
//     }

//     const startDateTime = constructDateWithTime(
//         startHour,
//         startMinute,
//         period,
//         selectedDate
//     )
//     const endDateTime = constructDateWithTime(
//         endHour,
//         endMinute,
//         period,
//         selectedDate
//     )

//     // Convert to UTC
//     const startUtc = fromZonedTime(startDateTime, selectedTimezone)
//     const endUtc = fromZonedTime(endDateTime, selectedTimezone)

//     // Convert UTC to Bangkok time
//     const startBangkok = toZonedTime(startUtc, 'Asia/Bangkok')
//     const endBangkok = toZonedTime(endUtc, 'Asia/Bangkok')

//     const formattedStart = formatInTimeZone(
//         startBangkok,
//         'Asia/Bangkok',
//         'hh:mm a'
//     )
//     const formattedEnd = formatInTimeZone(endBangkok, 'Asia/Bangkok', 'hh:mm a')

//     const label = `${formattedStart} - ${formattedEnd}`

//     return {
//         ...timeSlot,
//         label,
//     }
// }

// export { revertTimezone }

import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

interface TimeSlot {
    key: string
    start: string
    end: string
    period: string
    label: string
}

const parseTimeSlotString = (timeSlotStr: string): TimeSlot => {
    // Split the string by the ' - ' delimiter
    const parts = timeSlotStr.split(' - ')

    // Extract the start and end times
    const startStr = parts[0]
    let endStrWithPeriod = parts[1]
    // Check if there's an additional marker like '-1' at the end
    let additionalMarker = ''
    if (parts.length > 2) {
        additionalMarker = parts.slice(2).join(' - ')
    }

    // Extract the period from the end time
    let period = ''
    if (endStrWithPeriod.includes(' - ')) {
        ;[endStrWithPeriod, period] = endStrWithPeriod.split(' - ')
    }

    const [start, startPeriod] = startStr.split(' ')
    const [end, endPeriod] = endStrWithPeriod.split(' ')

    return {
        key: timeSlotStr,
        start,
        end,
        period: startPeriod,
        label: timeSlotStr,
    }
}

const revertTimezone = (
    timeSlotStr: string,
    selectedDate: Date
): TimeSlot | null => {
    const timeSlot = parseTimeSlotString(timeSlotStr)
    if (!timeSlot) {
        return null
    }

    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone // Get the local machine's timezone

    const { start, end, period } = timeSlot
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)

    const constructDateWithTime = (
        hour: number,
        minute: number,
        period: string,
        date: Date
    ): Date => {
        let time = new Date(date)
        time.setHours(
            hour +
                (period === 'PM' && hour !== 12 ? 12 : 0) -
                (period === 'AM' && hour === 12 ? 12 : 0),
            minute,
            0,
            0
        )
        return time
    }

    const startDateTime = constructDateWithTime(
        startHour,
        startMinute,
        period,
        selectedDate
    )
    const endDateTime = constructDateWithTime(
        endHour,
        endMinute,
        period,
        selectedDate
    )

    // Convert to UTC using the local machine's timezone
    const startUtc = fromZonedTime(startDateTime, localTimezone)
    const endUtc = fromZonedTime(endDateTime, localTimezone)

    // Convert UTC to Bangkok time
    const startBangkok = toZonedTime(startUtc, 'Asia/Bangkok')
    const endBangkok = toZonedTime(endUtc, 'Asia/Bangkok')

    const formattedStart = formatInTimeZone(
        startBangkok,
        'Asia/Bangkok',
        'hh:mm a'
    )
    const formattedEnd = formatInTimeZone(endBangkok, 'Asia/Bangkok', 'hh:mm a')

    const label = `${formattedStart} - ${formattedEnd}`

    return {
        ...timeSlot,
        label,
    }
}

export { revertTimezone }
