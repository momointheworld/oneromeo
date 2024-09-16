import { formatInTimeZone, toZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'

interface AppointmentData {
    thDate: Date
    thTime: string
    csrDate: Date
    csrTime: string
    csrTimeZone: string
    email: string
    createdAt: Date
}

const timeSlots = [
    { time: '02:30', date: new Date() }, // Predefined UTC time slots
    { time: '14:30', date: new Date() },
]

// Convert UTC time slots to local time zones
function convertTimeSlotToLocal(
    timeSlot: { time: string; date: Date },
    timeZone: string
): { date: string; time: string } {
    const fullDateTime = `${format(timeSlot.date, 'yyyy-MM-dd')}T${
        timeSlot.time
    }:00Z` // UTC time
    const zonedTime = toZonedTime(new Date(fullDateTime), timeZone)

    return {
        date: format(zonedTime, 'yyyy-MM-dd'),
        time: formatInTimeZone(zonedTime, timeZone, 'HH:mm'),
    }
}

export { convertTimeSlotToLocal, timeSlots }
