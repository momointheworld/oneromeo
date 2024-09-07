// import {
//     formatInTimeZone,
//     format,
//     toZonedTime,
//     fromZonedTime,
// } from 'date-fns-tz'

// interface TimeSlot {
//     key: string
//     start: string
//     end: string
//     period: string
//     label: string
// }

// const timeSlots: TimeSlot[] = [
//     {
//         key: '10:30 AM - 10:45 AM',
//         start: '10:30',
//         end: '10:45',
//         period: 'AM',
//         label: '10:30 AM - 10:45 AM', // Default label, can be updated after conversion
//     },
//     {
//         key: '0530 PM - 0545 PM',
//         start: '05:30',
//         end: '05:45',
//         period: 'PM',
//         label: '05:30 PM - 05:45 PM', // Default label, can be updated after conversion
//     },
//     {
//         key: '09:30 PM - 09:45 PM',
//         start: '09:30',
//         end: '09:45',
//         period: 'PM',
//         label: '09:30 PM - 09:45 PM', // Default label, can be updated after conversion
//     },
// ]

// const timeSlots: TimeSlot[] = [
//     {
//         key: '03:30 AM - 03:45 AM',
//         start: '03:30',
//         end: '03:45',
//         period: 'AM',
//         label: '03:30 AM - 03:45 AM', // Default label, can be updated after conversion
//     },
//     {
//         key: '1030 AM - 1045 AM',
//         start: '10:30',
//         end: '10:45',
//         period: 'PM',
//         label: '10:30 AM - 10:45 AM', // Default label, can be updated after conversion
//     },
//     {
//         key: '02:30 PM - 02:45 PM',
//         start: '02:30',
//         end: '02:45',
//         period: 'PM',
//         label: '02:30 PM - 02:45 PM', // Default label, can be updated after conversion
//     },
// ]

// const convertToUserTimezone = (
//     timeSlots: TimeSlot[],
//     selectedDate: Date,
//     selectedTimezone: string // New parameter for selected timezone
// ): TimeSlot[] => {
//     return timeSlots.map((slot) => {
//         const { start, end, period } = slot
//         const [startHour, startMinute] = start.split(':').map(Number)
//         const [endHour, endMinute] = end.split(':').map(Number)
//         let tag = '-1'

//         // Initialize startDateTime and endDateTime
//         let startDateTime = new Date(selectedDate)

//         startDateTime.setHours(
//             startHour + (period === 'PM' && startHour !== 12 ? 12 : 0),
//             startMinute,
//             0
//         )

//         let endDateTime = new Date(selectedDate)
//         endDateTime.setHours(
//             endHour + (period === 'PM' && endHour !== 12 ? 12 : 0),
//             endMinute,
//             0
//         )

//         // Utility function to get the offset in hours for a given timezone
//         const getTimezoneOffsetInHours = (date: Date, timezone: string) => {
//             const zonedDate = toZonedTime(date, timezone)
//             const utcDate = fromZonedTime(zonedDate, timezone)
//             return (zonedDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
//         }

//         // Utility function to format time and handle the special case for 12:xxam
//         const formatTimeLabel = (date: Date, timezone: string) => {
//             let formattedTime = formatInTimeZone(date, timezone, 'hh:mm a')
//             if (
//                 formattedTime.startsWith('12:') &&
//                 formattedTime.endsWith('AM')
//             ) {
//                 formattedTime = '00' + formattedTime.slice(2)
//             }
//             return formattedTime
//         }

//         // Convert to the selected timezone and format the time labels
//         const localStartFormatted = formatTimeLabel(
//             startDateTime,
//             selectedTimezone
//         )
//         const localEndFormatted = formatTimeLabel(endDateTime, selectedTimezone)

//         // Get timezone offsets
//         const bangkokOffset = getTimezoneOffsetInHours(
//             startDateTime,
//             'Asia/Bangkok'
//         )
//         const startOffset = getTimezoneOffsetInHours(
//             startDateTime,
//             selectedTimezone
//         )

//         // Calculate the difference
//         const offsetDifference = bangkokOffset - startOffset

//         // Prepare the labels with the necessary suffix
//         let localStartLabel = localStartFormatted
//         let localEndLabel = localEndFormatted

//         if (offsetDifference >= 10 && localStartLabel.includes('PM')) {
//             localEndLabel += ' -1'
//         } else if (offsetDifference < -1 && localStartLabel.includes('AM')) {
//             localEndLabel += ' +1'
//         }

//         const label = `${localStartLabel} - ${localEndLabel}`
//         return {
//             ...slot,
//             start: localStartFormatted.split(' ')[0], // Update start time
//             end: localEndFormatted.split(' ')[0], // Update end time
//             label,
//         }
//     })
// }

// export { convertToUserTimezone, timeSlots }

// import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

// interface TimeSlot {
//     key: string
//     start: string
//     end: string
//     period: string
//     label: string
// }

// const timeSlots: TimeSlot[] = [
//     {
//         key: '03:30 AM - 03:45 AM',
//         start: '03:30',
//         end: '03:45',
//         period: 'AM',
//         label: '03:30 AM - 03:45 AM', // Default label, can be updated after conversion
//     },
//     {
//         key: '10:30 AM - 10:45 AM',
//         start: '10:30',
//         end: '10:45',
//         period: 'AM',
//         label: '10:30 AM - 10:45 AM', // Default label, can be updated after conversion
//     },
//     {
//         key: '02:30 PM - 02:45 PM',
//         start: '02:30',
//         end: '02:45',
//         period: 'PM',
//         label: '02:30 PM - 02:45 PM', // Default label, can be updated after conversion
//     },
// ]

// const timeSlots: TimeSlot[] = [
//     {
//         key: '10:30 AM - 10:45 AM',
//         start: '10:30',
//         end: '10:45',
//         period: 'AM',
//         label: '10:30 AM - 10:45 AM', // Default label, can be updated after conversion
//     },
//     {
//         key: '0530 PM - 0545 PM',
//         start: '05:30',
//         end: '05:45',
//         period: 'PM',
//         label: '05:30 PM - 05:45 PM', // Default label, can be updated after conversion
//     },
//     {
//         key: '09:30 PM - 09:45 PM',
//         start: '09:30',
//         end: '09:45',
//         period: 'PM',
//         label: '09:30 PM - 09:45 PM', // Default label, can be updated after conversion
//     },
// ]

// const convertToUserTimezone = (
//     timeSlots: TimeSlot[],
//     selectedDate: Date
// ): TimeSlot[] => {
//     const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

//     return timeSlots.map((slot) => {
//         const { start, end, period } = slot

//         // Combine date and time for start and end in UTC
//         const startTimeUTC = new Date(
//             `${selectedDate.toDateString()} ${start} ${period} UTC`
//         )
//         const endTimeUTC = new Date(
//             `${selectedDate.toDateString()} ${end} ${period} UTC`
//         )

//         // Convert start and end times to the local timezone
//         const localStartTime = toZonedTime(startTimeUTC, localTimezone)
//         const localEndTime = toZonedTime(endTimeUTC, localTimezone)

//         const formatTimeLabel = (date: Date, timezone: string) => {
//             let formattedTime = formatInTimeZone(date, timezone, 'hh:mm a')
//             if (
//                 formattedTime.startsWith('12:') &&
//                 formattedTime.endsWith('AM')
//             ) {
//                 formattedTime = '00' + formattedTime.slice(2)
//             }
//             return formattedTime
//         }

//         // Format the times for the local timezone
//         const localStartFormatted = formatTimeLabel(
//             localStartTime,
//             localTimezone
//         )

//         const localEndFormatted = formatTimeLabel(localEndTime, localTimezone)

//         // // Calculate time differences in hours
//         // const startDiffHours =
//         //     startTimeUTC.getTime() - localStartTime.getTime() / (1000 * 60 * 60)
//         // const endDiffHours =
//         //     endTimeUTC.getTime() - localStartTime.getTime() / (1000 * 60 * 60)

//         // Determine the appropriate tags based on the time difference
//         let localEndLabel = localEndFormatted

//         // Create the new label based on the local timezone with the tag if necessary
//         const label = `${localStartFormatted} - ${localEndLabel}`
//         return {
//             ...slot,
//             start: localStartFormatted.split(' ')[0], // Update start time
//             end: localEndFormatted.split(' ')[0], // Update end time
//             label,
//         }
//     })
// }

// export { convertToUserTimezone, timeSlots }

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
    // {
    //     key: '09:30 PM - 09:45 PM',
    //     start: '09:30',
    //     end: '09:45',
    //     period: 'PM',
    //     label: '09:30 PM - 09:45 PM', // Default label, can be updated after conversion
    // },
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

        // Get the start and end times in hours since midnight for comparison
        const thaiStartHours =
            startTimeThai.getHours() + startTimeThai.getMinutes() / 60
        const thaiEndHours =
            endTimeThai.getHours() + endTimeThai.getMinutes() / 60
        const localStartHours =
            localStartTime.getHours() + localStartTime.getMinutes() / 60
        const localEndHours =
            localEndTime.getHours() + localEndTime.getMinutes() / 60

        // Determine the offset difference in hours
        const offsetHours = thaiStartHours - localStartHours

        // Add tags based on the time difference
        let localEndLabel = localEndFormatted

        if (
            offsetHours >= -6 &&
            offsetHours <= 10 &&
            localEndLabel.includes('PM')
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

// Usage example
const selectedDate = new Date() // Use any selected date
const updatedTimeSlots = convertToUserTimezone(timeSlots, selectedDate)
console.log(updatedTimeSlots)
