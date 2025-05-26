import { useState } from "react";
import Calendar, { type CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Props = {
  onDateSelect: (date: Date) => void;
};

const CalendarView = ({ onDateSelect }: Props) => {
  const [date, setDate] = useState<Date | null>(new Date());

  const handleChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value) || value === null) return;
    setDate(value);
    onDateSelect(value);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Select Event Date</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 w-full max-w-md">
        <Calendar
          onChange={handleChange}
          value={date}
          calendarType="iso8601"
          className="custom-calendar border-0"
          minDetail="month"
          next2Label={null}
          prev2Label={null}
          navigationLabel={({ date }) => (
            <span className="text-gray-800 dark:text-gray-200 font-semibold">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          )}
        />
      </div>
    </div>
  );
};

export default CalendarView;