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

                setAppointments(formattedAppointments)
                console.log(formattedAppointments)
            } catch (err) {
                console.error('Error fetching appointments:', err)
                // Handle error scenario if needed
            }
        }

        fetchAppointments()
    }, [])

    return (
        <div>
            <h1>Appointments</h1>
            {appointments.length === 0 ? (
                <FullSkeleton />
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            {appointment.date.toDateString()} -{' '}
                            {appointment.timeSlot}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default AppointmentsPage
