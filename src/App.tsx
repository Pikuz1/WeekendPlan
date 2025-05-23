import React, { useState } from 'react';
import CalendarView from './components/CalendarView';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">WeekendPlan</h1>
        <CalendarView onDateSelect={setSelectedDate} />
        {selectedDate && (
          <p className="mt-4 text-center text-green-400">
            You selected: {selectedDate.toDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
