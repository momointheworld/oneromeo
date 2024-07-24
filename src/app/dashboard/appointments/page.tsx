'use client'
import { getAppointments } from '@/actions'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import RenderAppointments from '@/components/renderAppointments'
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Pagination } from '@nextui-org/react'

interface Appointment {
    id: string
    date: Date
    thTimeSlot: string
    csrTimeSlot: string
    timeZone: string
    email: string
}

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [index, setIndex] = useState(1)
    const appointmentsPerPage = 30

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                console.log(data)

                // Map fetched data to match the Appointment type
                const formattedAppointments: Appointment[] = data.map(
                    (appointment) => ({
                        id: appointment.id,
                        date: new Date(appointment.date),
                        timeZone: appointment.timeZone,
                        thTimeSlot: appointment.thTimeSlot,
                        csrTimeSlot: appointment.csrTimeSlot,
                        email: appointment.email,
                    })
                )

                // Sort appointments by date in descending order
                const sortedAppointments = formattedAppointments.sort(
                    (a, b) => b.date.getTime() - a.date.getTime()
                )

                setAppointments(sortedAppointments)
                setLoading(false)
                console.log(sortedAppointments)
            } catch (err) {
                console.error('Error fetching appointments:', err)
                setError('Failed to fetch appointments.')
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    const indexOfLastAppointment = page * appointmentsPerPage
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage
    const currentAppointments = appointments.slice(
        indexOfFirstAppointment,
        indexOfLastAppointment
    )

    const totalPages = Math.ceil(appointments.length / appointmentsPerPage)

    return (
        <div>
            <h1>Appointments</h1>
            {loading ? (
                <FullSkeleton />
            ) : error ? (
                <div>{error}</div>
            ) : (
                <>
                    <RenderAppointments
                        latestAppointments={currentAppointments}
                        startIndex={indexOfFirstAppointment + 1}
                    />
                    <div className="flex justify-center mt-5">
                        <Pagination
                            total={totalPages}
                            initialPage={1}
                            page={page}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default AppointmentsPage
