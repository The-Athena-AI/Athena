import React from "react";
import SearchBar from "./studentHomeComponents/SearchBar";
import WelcomeCard from "./studentHomeComponents/WelcomeCard";
import PerformanceChart from "./studentHomeComponents/PerformanceChart";
import MessagesPanel from "./studentHomeComponents/MessagesPanel";
import Calendar from "./studentHomeComponents/Calendar";
import UpcomingActivities from "./studentHomeComponents/UpcomingActivites";
import TopPerformingStudents from "./studentHomeComponents/TopPerformingStudents";

const StudentHome = () => {
  return (
    <div className="p-6">
      <SearchBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeCard />
          <PerformanceChart />
          <MessagesPanel />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <Calendar />
          <UpcomingActivities />
          <TopPerformingStudents />
        </div>
      </div>
    </div>
  );
};

export default StudentHome;