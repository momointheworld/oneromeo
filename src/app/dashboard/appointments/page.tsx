'use client'
import { getAppointments } from '@/actions'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import RenderAppointments from '@/components/renderAppointments'
import { Button, Link } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Pagination } from '@nextui-org/react'
import { deleteAppointment } from '@/actions/deleteAppointment'
import { useFormState } from 'react-dom'
import { log } from 'console'
import DisplayMessage from '@/components/common/message'
import paths from '@/components/paths'
import PageBreadCrumbs from '@/components/common/breadcrumbs'
import { format, toZonedTime } from 'date-fns-tz'

interface Appointment {
    id: string
    date: Date
    thTimeSlot: string
    csrTimeSlot: string
    timeZone: string
    email: string
}

interface Breadcrumb {
    href: string
    text: string
}

const AllAppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [index, setIndex] = useState(1)
    const appointmentsPerPage = 30
    const [formMessage, setFormMessage] = useState('')
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllAppointments(), text: 'Appointments' },
    ]

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments()
                console.log(data)

                // Map fetched data to match the Appointment type
                const formattedAppointments: Appointment[] = data.map(
                    (appointment) => ({
                        id: appointment.id,
                        date: appointment.date,
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

    const handleDelete = async (id: string) => {
        if (!handleDelete) return // No-op if handleDelete is not defined
        console.log(id)
        try {
            await deleteAppointment(id)
            setFormMessage('Appointment deleted successfully')

            // Fetch the updated appointments list
            const updatedAppointments = await getAppointments()
            const formattedAppointments: Appointment[] =
                updatedAppointments.map((appointment) => ({
                    id: appointment.id,
                    date: new Date(appointment.date),
                    timeZone: appointment.timeZone,
                    thTimeSlot: appointment.thTimeSlot,
                    csrTimeSlot: appointment.csrTimeSlot,
                    email: appointment.email,
                }))

            // Sort appointments by date in descending order
            const sortedAppointments = formattedAppointments.sort(
                (a, b) => b.date.getTime() - a.date.getTime()
            )

            setAppointments(sortedAppointments)
            // Reset message after 5 seconds
            setTimeout(() => {
                setFormMessage('')
            }, 5000)
        } catch (error) {
            console.error('Error deleting appointment:', error)
            setFormMessage('Failed to delete appointment.')
        }
    }

    return (
        <div>
            <PageBreadCrumbs items={breadcrumbs} />
            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <h1>Appointments</h1>
                    <div>
                        <Link
                            href={paths.createNewAppointment()}
                            className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                        >
                            Create Appointment
                        </Link>
                    </div>
                </div>
                {loading ? (
                    <FullSkeleton />
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <>
                        <DisplayMessage formStateMessage={formMessage} />
                        <RenderAppointments
                            latestAppointments={currentAppointments}
                            startIndex={indexOfFirstAppointment + 1}
                            handleDelete={handleDelete}
                            showDeleteButton={true}
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
        </div>
    )
}

export default AllAppointmentsPage
function utcToZonedTime(date: string, timeZone: string) {
    throw new Error('Function not implemented.')
}
