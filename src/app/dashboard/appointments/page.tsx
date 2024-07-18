// app/appointmentsPage.tsx
'use client'
import { getAppointments } from '@/actions'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import { useEffect, useState } from 'react'

type Appointment = {
    id: number
    timeZone: String
    date: Date
    thTimeSlot: string
    csrTimeSlot: string
    email: string
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
                        timeZone: appointment.timeZone,
                        date: new Date(appointment.date),
                        thTimeSlot: appointment.thTimeSlot,
                        csrTimeSlot: appointment.csrTimeSlot,
                        email: appointment.email,
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
                            <p>
                                {' '}
                                Bangkok Time: {appointment.date.toDateString()}{' '}
                                -{appointment.thTimeSlot}
                            </p>
                            <p>
                                {' '}
                                Customer Time: {appointment.date.toDateString()}{' '}
                                -{appointment.csrTimeSlot}
                            </p>
                            <p>Customer TimeZone: {appointment.timeZone}</p>
                            <p>Customer Email: {appointment.email}</p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}

export default AppointmentsPage
