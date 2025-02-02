import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaBook, 
  FaCalendar,
  FaClock,
  FaFileAlt
} from 'react-icons/fa';
import { supabase } from '../supabase';

const StudentClasses = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [classAssignments, setClassAssignments] = useState({});

  useEffect(() => {
    fetchEnrolledClasses();
  }, [userId]);

  const fetchEnrolledClasses = async () => {
    try {
      setLoading(true);
  
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('classenrollments')
        .select(`
          id,
          class:classes(
            id,
            name,
            description,
            teacherid,
            teacher:UserInfo!classes_teacherid_fkey(
              id,
              email,
              name,
              role
            ),
            assignments:CreateAssignments(
              id,
              class_id,
              title,
              description,
              due_date,
              points,
              submissions:SubmittedAssignment(
                id,
                status,
                submitted_at,
                teacher_grade,
                ai_grade
              )
            )
          )
        `)
        .eq('studentid', userId);
        console.log('Enrollments:', enrollments);
      if (enrollmentError) throw enrollmentError;
  
      // Process data more safely
      const classes = enrollments
      .filter(e => e?.class) // Filter null classes
      .map(e => ({
        ...e.class,
        teacher: e.class.teacher || null,
        assignments: e.class.assignments || []
      }));

    const assignments = {};
    classes.forEach(cls => {
      assignments[cls.id] = cls.assignments
        .filter(a => a) // Filter null assignments
        .map(a => ({
          ...a,
          submissions: a.submissions || []
        }));
    });

    setEnrolledClasses(classes);
    setClassAssignments(assignments);

  } catch (err) {
    console.error('Error fetching enrolled classes:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Loading classes...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen themed-bg p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold themed-text mb-8">My Classes</h1>

        {error && (
          <div className="themed-error px-4 py-2 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Enrolled Classes Grid */}
        <div className="grid grid-cols-1 gap-6">
          {enrolledClasses.map((classItem) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold themed-text">{classItem.name}</h2>
                    <p className="themed-text-secondary mt-2">{classItem.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaChalkboardTeacher className="themed-icon text-xl" />
                    <div className="text-right">
                      <div className="themed-text">
                        {classItem.teacher?.name || 'No teacher assigned'}
                      </div>
                      <div className="text-sm themed-text-secondary">
                        {classItem.teacher?.email || classItem.teacherid}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class Assignments */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold themed-text mb-4">Assignments</h3>
                  <div className="space-y-4">
                    {classAssignments[classItem.id].length > 0 ? (
                      classAssignments[classItem.id].map((assignment) => (
                        <div
                          key={assignment.id}
                          className="themed-bg-elevated rounded-lg p-4 hover:themed-bg-hover transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium themed-text">{assignment.title}</h4>
                              <p className="text-sm themed-text-secondary mt-1">{assignment.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm themed-text-secondary flex items-center gap-2">
                                <FaClock />
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                              </div>
                              <div className="text-sm themed-text-secondary flex items-center gap-2">
                                <FaFileAlt />
                                Points: {assignment.points}
                              </div>
                            </div>
                          </div>
                          {assignment.submissions?.[0] && (
                            <div className="mt-2 text-sm">
                              <span className="themed-text-success">
                                Submitted • Grade: {assignment.submissions[0]?.teacher_grade || assignment.submissions[0]?.ai_grade || 'Pending'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="themed-text-secondary">No assignments yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {enrolledClasses.length === 0 && (
          <div className="text-center py-8">
            <div className="themed-text mb-2">
              <FaBook className="inline-block text-4xl" />
            </div>
            <h2 className="text-xl font-semibold themed-text mb-2">No Classes Yet</h2>
            <p className="themed-text-secondary">
              You haven't been enrolled in any classes yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClasses; 