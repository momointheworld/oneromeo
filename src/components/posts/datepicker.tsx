// // components/DatePickerInput.tsx
// 'use client';
// import React, { useState } from 'react';
// import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { registerLocale, setDefaultLocale } from  "react-datepicker";
// import { es } from 'date-fns/locale/es';
// registerLocale('es', es)

// interface DatePickerProps {
//     name: string;
//     selected: Date;
//     onChange: (date: Date | null) => void; 
// }

// const DatePickerInput = ({ name, selected, onChange }: DatePickerProps) => {
//     return (
//         <DatePicker
//             dateFormat="yyyy/MM/dd"
//             showIcon
//             selected={selected}
//             locale={'es'}
//             name={name}
//             onChange={onChange}
//         />
//     );
// };

// export default DatePickerInput;
