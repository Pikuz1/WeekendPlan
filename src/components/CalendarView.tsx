import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Props = {
  onDateSelect: (date: Date) => void;
};

const CalendarView = ({ onDateSelect }: Props) => {
  const [date, setDate] = useState(new Date());

  const handleChange = (value: Date | Date[]) => {
    if (Array.isArray(value)) return;
    setDate(value);
    onDateSelect(value);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Select a Date</h2>
      <div className="bg-white text-black p-4 rounded-lg shadow-lg">
        <Calendar onChange={handleChange} value={date} />
      </div>
    </div>
  );
};

export default CalendarView;
