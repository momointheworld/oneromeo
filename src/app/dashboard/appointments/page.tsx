// app/appointmentsPage.tsx
'use client'
import { getAppointments } from '@/actions'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import { useEffect, useState } from 'react'

type Appointment = {
    id: number
    date: Date
    timeSlot: string
}

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                console.log(data)

                // Map fetched data to match the Appointment type
                const formattedAppointments: Appointment[] = data.map(
                    (appointment) => ({
                        id: parseInt(appointment.id), // Assuming id is converted to number
                        date: new Date(appointment.date),
                        timeSlot: appointment.timeSlot,
                    })
                )

                // Sort appointments by date in descending order
                const sortedAppointments = formattedAppointments.sort(
                    (a, b) => b.date.getTime() - a.date.getTime()
                )

                // Get the latest 30 appointments
                const latestAppointments = sortedAppointments.slice(0, 30)

                setAppointments(latestAppointments)
                setLoading(false)
                console.log(latestAppointments)
            } catch (err) {
                console.error('Error fetching appointments:', err)
                setError('Failed to fetch appointments.')
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    return (
        <div>
            <h1>Appointments</h1>
            {loading ? (
                <FullSkeleton />
            ) : error ? (
                <div>{error}</div>
            ) : (
                <ol reversed style={{ listStyleType: 'decimal-leading-zero' }}>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            {appointment.date.toDateString()} -{' '}
                            {appointment.timeSlot}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}

export default AppointmentsPage
