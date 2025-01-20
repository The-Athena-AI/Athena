import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AssignmentStats = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch stats from backend
    const fetchStats = async () => {
      try {
        // Mock data
        const mockStats = {
          totalStudents: 25,
          submitted: 20,
          graded: 15,
          averageGrade: 85.5,
          medianGrade: 87,
          gradeDistribution: {
            'A (90-100)': 5,
            'B (80-89)': 7,
            'C (70-79)': 2,
            'D (60-69)': 1,
            'F (0-59)': 0
          },
          submissionTimeline: [
            { date: '2024-03-20', count: 5 },
            { date: '2024-03-21', count: 8 },
            { date: '2024-03-22', count: 7 }
          ]
        };
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Submissions</h3>
          <p className="text-2xl font-bold">{stats.submitted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Grade</h3>
          <p className="text-2xl font-bold">{stats.averageGrade}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Median Grade</h3>
          <p className="text-2xl font-bold">{stats.medianGrade}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Grade Distribution</h2>
          <div className="space-y-2">
            {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center">
                <span className="w-24">{grade}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded">
                  <div
                    className="h-full bg-blue-500 rounded"
                    style={{
                      width: `${(count / stats.graded) * 100}%`
                    }}
                  />
                </div>
                <span className="w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Submission Timeline</h2>
          <div className="space-y-2">
            {stats.submissionTimeline.map((day) => (
              <div key={day.date} className="flex items-center">
                <span className="w-24 text-sm">{day.date}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{
                      width: `${(day.count / stats.totalStudents) * 100}%`
                    }}
                  />
                </div>
                <span className="w-12 text-right">{day.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentStats; 