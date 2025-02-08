import React, { useState } from 'react';
import Calendar from 'react-calendar';

const FuncCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = date =>{
    setDate(date);
  }
  return (
    <div className="calendar" style={{ backgroundColor: '#ECF0F1', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
      <Calendar onChange={onChange} value={date} />
    </div>
  );
};

export default FuncCalendar;