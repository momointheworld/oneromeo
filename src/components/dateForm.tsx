// 'use client';
// import React,{useState} from "react";
// import DatePickerInput from "./datepicker";

// interface DateFormProps {
//     name: string;
// }


// export default function DateForm( {name}: DateFormProps) {
//     const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
//       const handleDateChange = (date: Date | null) => {
//         setSelectedDate(date);
//         if (date) {
//             const options: Intl.DateTimeFormatOptions = { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//             };
//             const dateString = date.toLocaleDateString('en-US', options);
//             console.log(dateString); // This will log something like "March 8, 2024"
//             return dateString;
//         }
//     };
//     return(
//             <div className="text-zinc-900">
//             <DatePickerInput name={name} onChange={handleDateChange} />
//             </div>
//     )

// }

