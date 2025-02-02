import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaEnvelope, FaClock } from 'react-icons/fa';

const TeacherStudents = ({ userId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [userId]);

  const fetchStudents = async () => {
    try {
      // First get all classes taught by this teacher
      const { data: classes, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('teacherid', userId);

      if (classError) throw classError;

      if (!classes || classes.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Then get all students enrolled in these classes
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('classenrollments')
        .select(`
          student:UserInfo(
            id,
            name,
            email,
            created_at
          ),
          class:classes(
            name
          )
        `)
        .in('classid', classes.map(c => c.id));

      if (enrollmentError) throw enrollmentError;

      // Deduplicate students while preserving class information
      const uniqueStudents = Array.from(
        new Map(
          enrollments.map(enrollment => [
            enrollment.student.id,
            {
              student: enrollment.student,
              classes: enrollments
                .filter(e => e.student.id === enrollment.student.id)
                .map(e => e.class.name)
            }
          ])
        ).values()
      );

      setStudents(uniqueStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen themed-bg flex items-center justify-center">
        <div className="themed-text">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="themed-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold themed-text">Student Roster</h1>
        </div>

        {error && (
          <div className="themed-error mb-4 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(({ student, classes }) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="themed-card rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <div className="themed-icon-bg p-3 rounded-full">
                  <FaUserGraduate className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold themed-text">{student.name}</h3>
                  <div className="themed-text-secondary mt-2 flex items-center gap-2">
                    <FaEnvelope className="text-sm" />
                    <span>{student.email}</span>
                  </div>
                  <div className="themed-text-secondary mt-1 flex items-center gap-2">
                    <FaClock className="text-sm" />
                    <span>Joined: {new Date(student.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 text-sm themed-text-secondary">
                    <strong>Enrolled in:</strong> {classes.join(', ')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;