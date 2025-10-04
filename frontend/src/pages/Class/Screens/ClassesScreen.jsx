// src/screens/ClassesScreen.jsx

import  { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import DateSelector from '../components/DateSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import ClassCard from '../components/ClassCard';
import { getTodayDateString } from '../Utils/helper';

const ClassesScreen = ({
  loading,
  error,
  classes = [] ,
  selectedDate,
  setSelectedDate,
  fetchClasses,
  onClassSelect,
  onNavChange,
}) => {
  const safeClasses = Array.isArray(classes) ? classes : [];

  useEffect(() => {
    // Re-fetch classes whenever the selectedDate changes
    fetchClasses(selectedDate);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // The useEffect above will handle the fetchClasses call
  };

  const headerContent = (
    <>
      <h1 className="page-title">Available Classes</h1>
      <button className="profile-button">👤</button>
    </>
  );

  return (
    <AppLayout headerContent={headerContent} activeNav="classes" onNavChange={onNavChange}>
      <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />

      {loading && <LoadingSpinner message="Loading classes..." />}

      {error && <ErrorMessage message={error} onRetry={() => fetchClasses(selectedDate)} />}

      {classes.length === 0 && !loading && !error && (
        <EmptyState
          icon="📅"
          title="No Classes Available"
          message="There are no classes scheduled for this date"
        />
      )}

      
    
      
      <div className="classes-list">
  {safeClasses.map(classItem => (
    <ClassCard
      key={classItem._id}
      classItem={classItem}
      onBookClick={onClassSelect}
    />
  ))}
 
</div>

    </AppLayout>
  );
};

ClassesScreen.defaultProps = {
  selectedDate: getTodayDateString()
};

export default ClassesScreen;


