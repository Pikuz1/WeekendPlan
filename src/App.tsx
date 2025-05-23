import React, { useState } from 'react';
import CalendarView from './components/CalendarView';
import Auth from './components/Auth';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">WeekendPlan</h1>
      <Auth />
    </div>
  );
}

export default App;
