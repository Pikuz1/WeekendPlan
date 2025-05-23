import React, { useState } from "react";
import Calendar, { type CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Props = {
  onDateSelect: (date: Date) => void;
};

const CalendarView = ({ onDateSelect }: Props) => {
  // Allow date to be null as react-calendar might send null sometimes
  const [date, setDate] = useState<Date | null>(new Date());

  const handleChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value)) return; // ignore range for now
    if (value === null) return; // ignore null
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
