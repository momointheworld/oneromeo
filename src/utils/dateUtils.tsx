import { DateTime } from 'luxon'

// Types for function parameters and returns
interface DateInput {
    date: Date | string
    timezone: string
}

interface DateTimeOperations {
    localToUTC: (params: DateInput) => Date
    UTCToLocal: (params: DateInput) => Date
    formatDate: (params: DateInput & { format?: string }) => string
}

// Utility functions with TypeScript types
export const dateUtils: DateTimeOperations = {
    localToUTC: ({ date, timezone }: DateInput): Date => {
        // If date is already a Date object, convert to ISO string
        const dateString = date instanceof Date ? date.toISOString() : date

        // Create DateTime object in the local timezone
        const localDateTime = DateTime.fromISO(dateString, { zone: timezone })

        if (!localDateTime.isValid) {
            throw new Error('Invalid date or timezone provided')
        }

        // Convert to UTC
        const utcDateTime = localDateTime.toUTC()

        // Return as JavaScript Date object
        return new Date(utcDateTime.toISO())
    },

    UTCToLocal: ({ date, timezone }: DateInput): Date => {
        // Create DateTime object in UTC
        const utcDateTime = DateTime.fromJSDate(
            date instanceof Date ? date : new Date(date),
            {
                zone: 'utc',
            }
        )

        if (!utcDateTime.isValid) {
            throw new Error('Invalid date or timezone provided')
        }

        // Convert to target timezone
        const localDateTime = utcDateTime.setZone(timezone)

        return localDateTime.toJSDate()
    },

    formatDate: ({
        date,
        timezone,
        format = 'yyyy-MM-dd HH:mm:ss',
    }: DateInput & {
        format?: string
    }): string => {
        const dateTime = DateTime.fromJSDate(
            date instanceof Date ? date : new Date(date),
            {
                zone: timezone,
            }
        )

        if (!dateTime.isValid) {
            throw new Error('Invalid date or timezone provided')
        }

        return dateTime.toFormat(format)
    },
}
