import React, { useState } from 'react';
import Calendar from '../Widgets/Calendar';
// import '../../styles/index.css';

const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calendar</h2>
      <Calendar 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate}
      />
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm text-gray-700 dark:text-gray-300">
        <p>Selected: {selectedDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default CalendarWidget;
