'use client'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'

type CustomDatePickerProps = {
    selected: Date | null
    onChange: (date: Date | null) => void
    placeholder?: string
    startDate?: Date | null
    endDate?: Date | null
    selectsStart?: boolean
    selectsEnd?: boolean
}

export default function CustomDatePicker({
    selected,
    onChange,
    placeholder,
    startDate,
    endDate,
    selectsStart,
    selectsEnd
}: CustomDatePickerProps) {
    const dateInputClass =
        'px-3 py-2 w-36 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-gray-50 placeholder:text-gray-400'

    const calendarClass =
        '!bg-white !border !border-gray-200 !rounded-lg !shadow-md p-3 font-sans text-sm'

    const customDayClass = (selectedDate: Date | null) => (date: Date) =>
        `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-colors
   ${selectedDate && date.getTime() === selectedDate.getTime()
            ? 'bg-blue-500 text-white'
            : 'hover:bg-blue-100 hover:text-blue-600'
        }`

    return (
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-2">
            <Calendar className="w-4 h-4 text-gray-400 ml-1" />
            <DatePicker
                selected={selected}
                onChange={onChange}
                selectsStart={selectsStart}
                selectsEnd={selectsEnd}
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                placeholderText={placeholder}
                className={`${dateInputClass} border-none bg-transparent`}
                calendarClassName={calendarClass}
                dayClassName={customDayClass(selected)}
            />
        </div>
    )
}
