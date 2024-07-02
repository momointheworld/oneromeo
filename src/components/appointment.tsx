'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Button, DatePicker, Select, SelectItem } from '@nextui-org/react'
import {
    today,
    DateValue,
    CalendarDate,
    getLocalTimeZone,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'
import { I18nProvider } from '@react-aria/i18n'
import DisplayMessage from '@/components/common/message'

type HandleSubmitType = (
    event: FormEvent<HTMLFormElement>
) => void | Promise<void>

interface TimeSlot {
    key: string
    label: string
}

interface AddAppointmentProps {
    handleSubmit: HandleSubmitType
    handleDateChange: (date: DateValue | null) => void
    handleTimeChange: React.ChangeEventHandler<HTMLSelectElement>
    selectedDate: DateValue | null
    newDisabledRanges: CalendarDate[][]
    availableSlots: TimeSlot[]
    pickedTime: string
    formStateMessage: string
}

const AddAppointment: React.FC<AddAppointmentProps> = ({
    handleSubmit,
    handleDateChange,
    handleTimeChange,
    selectedDate,
    newDisabledRanges,
    availableSlots,
    pickedTime,
    formStateMessage,
}) => {
    let now = today(getLocalTimeZone())
    let startDate = now.add({ days: 1 }) // Tomorrow
    let { locale } = useLocale()
    const [isLoading, setIsLoading] = useState(false)

    let isDateUnavailable = (date: DateValue) =>
        newDisabledRanges.some(
            (interval) =>
                date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
        )

    const formatDate = (date: DateValue | null): string => {
        if (!date) return ''
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
            date.day
        ).padStart(2, '0')}`
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-center">Make An Appointment</h3>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
                <div>
                    <I18nProvider locale="en-US">
                        <DatePicker
                            label="Appointment Date"
                            aria-label="Appointment Date"
                            isDateUnavailable={isDateUnavailable}
                            minValue={startDate}
                            onChange={handleDateChange}
                            className="w-full mb-4"
                        />
                    </I18nProvider>
                </div>
                <div className="max-w-md mx-auto flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                        label="Time Slot"
                        placeholder="Select a time slot"
                        className="max-w-md"
                        isDisabled={!selectedDate}
                        selectedKeys={[pickedTime]}
                        onChange={handleTimeChange}
                    >
                        {availableSlots.map((slot) => (
                            <SelectItem key={slot.key} value={slot.key}>
                                {slot.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="mt-10">
                    <div className="text-lg">
                        Date Picked:
                        <p className="p-4 text-primary rounded text-center">
                            {formatDate(selectedDate)}
                        </p>
                    </div>
                    <div className="text-lg">
                        Time Slot Picked:
                        <p className="p-4 text-primary rounded text-center">
                            {pickedTime}
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <Button isLoading={isLoading} type="submit" color="primary">
                        Add Appointment
                    </Button>
                    {/* Can not use FormButton on client component */}
                </div>
                <DisplayMessage
                    formStateMessage={formStateMessage}
                    actions={function (): Promise<FormData> {
                        throw new Error('Function not implemented.')
                    }}
                />
            </div>
        </form>
    )
}

export default AddAppointment
