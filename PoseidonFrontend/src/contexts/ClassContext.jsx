import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc
} from 'firebase/firestore';

const ClassContext = createContext();

export const useClass = () => useContext(ClassContext);

export const ClassProvider = ({ children }) => {
  const { user } = useUserAuth();
  const [userClasses, setUserClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserClasses();
    } else {
      setUserClasses([]);
      setEnrolledClasses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserClasses = async () => {
    try {
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'student',
          enrolledClasses: {},
          classes: {}
        });
        setUserClasses([]);
        setEnrolledClasses([]);
        setLoading(false);
        return;
      }

      // If user is a teacher, fetch their created classes
      if (userData.role === 'teacher') {
        const classesQuery = query(
          collection(db, 'classes'),
          where('teacherId', '==', user.uid)
        );
        const classesSnapshot = await getDocs(classesQuery);
        const classes = classesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserClasses(classes);
      }

      // Fetch enrolled classes (for both teachers and students)
      const enrolledClassIds = userData.enrolledClasses || {};
      const enrolled = await Promise.all(
        Object.keys(enrolledClassIds).map(async (classId) => {
          const classDoc = await getDoc(doc(db, 'classes', classId));
          if (classDoc.exists()) {
            return { id: classDoc.id, ...classDoc.data() };
          }
          return null;
        })
      );
      setEnrolledClasses(enrolled.filter(Boolean));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  // Create a new class (teacher only)
  const createClass = async (className) => {
    try {
      const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newClass = {
        name: className,
        code: classCode,
        teacherId: user.uid,
        teacherEmail: user.email,
        students: {},
        assignments: {},
        createdAt: new Date().toISOString()
      };
      
      const classRef = await addDoc(collection(db, 'classes'), newClass);
      
      // Update teacher's classes list
      await updateDoc(doc(db, 'users', user.uid), {
        [`classes.${classRef.id}`]: true
      });
      
      await fetchUserClasses();
      return classCode;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  };

  // Join a specific teacher's class using code
  const joinClass = async (classCode) => {
    try {
      if (!user) throw new Error('Must be logged in to join a class');

      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      );
      const classSnapshot = await getDocs(classesQuery);
      
      if (classSnapshot.empty) {
        throw new Error('Invalid class code');
      }

      const classDoc = classSnapshot.docs[0];
      const classId = classDoc.id;
      const classData = classDoc.data();

      // Check if already enrolled
      if (classData.students && classData.students[user.uid]) {
        throw new Error('You are already enrolled in this class');
      }

      // Add student to class
      await updateDoc(doc(db, 'classes', classId), {
        [`students.${user.uid}`]: {
          email: user.email,
          joinedAt: new Date().toISOString()
        }
      });

      // Add class to student's enrolled classes
      await updateDoc(doc(db, 'users', user.uid), {
        [`enrolledClasses.${classId}`]: true
      });

      await fetchUserClasses();
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  };

  const value = {
    userClasses,        // Classes created by teacher
    enrolledClasses,    // Classes joined using code
    loading,
    createClass,
    joinClass,
    fetchUserClasses
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}; 