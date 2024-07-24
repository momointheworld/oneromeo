import React from 'react'
import { format } from 'date-fns'

interface Appointment {
    id: string
    date: Date
    thTimeSlot: string
    csrTimeSlot: string
    timeZone: string
    email: string
}

interface RenderAppointmentsProps {
    latestAppointments: Appointment[]
    startIndex: number
}

const RenderAppointments: React.FC<RenderAppointmentsProps> = ({
    latestAppointments,
    startIndex,
}) => (
    <table className="min-w-full bg-white border-collapse block md:table">
        <thead className="block md:table-header-group">
            <tr className="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">
                    Index
                </th>
                <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">
                    Appointment Date
                </th>
                <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">
                    TH Time Slot
                </th>
                <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">
                    Customer Timezone
                </th>
                <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">
                    Customer Time Slot
                </th>
                <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">
                    Email
                </th>
            </tr>
        </thead>
        <tbody className="block md:table-row-group">
            {latestAppointments.map((app, index) => {
                const formattedDate = format(new Date(app.date), 'MMMM d, yyyy')
                return (
                    <tr
                        key={app.id}
                        className="bg-white border border-gray-300 md:border-none block md:table-row"
                    >
                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                            {startIndex + index}
                        </td>
                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                            {formattedDate}
                        </td>
                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                            {app.thTimeSlot}
                        </td>
                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                            {app.timeZone}
                        </td>
                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                            {app.csrTimeSlot}
                        </td>
                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                            {app.email}
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table>
)

export default RenderAppointments
