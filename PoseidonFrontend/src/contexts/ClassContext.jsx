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
  updateDoc,
  writeBatch
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

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      const userData = userDoc.data();
      
      console.log('userData:', userData);
      console.log('User Role:', userData?.Role);

      if (!userData) {
        console.log('No user data found, creating new user document');
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          Role: 'Student',
          enrolledClasses: {},
          classes: {},
          createdAt: new Date().toISOString()
        });
        setUserClasses([]);
        setEnrolledClasses([]);
        setLoading(false);
        return;
      }

      // If user is a teacher, fetch their created classes
      if (userData.Role === 'Teacher') {
        try {
          console.log('Fetching classes for teacher:', user.uid);
          const classesQuery = query(
            collection(db, 'classes'),
            where('teacherId', '==', user.uid)
          );
          const classesSnapshot = await getDocs(classesQuery);
          const classes = classesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log('Found classes:', classes);
          setUserClasses(classes);
        } catch (error) {
          console.error('Error fetching teacher classes:', error);
        }
      }

      // Fetch enrolled classes (for both teachers and students)
      try {
        const enrolledClassIds = userData.enrolledClasses || {};
        console.log('Enrolled Class IDs:', enrolledClassIds); // Debug log

        const enrolled = await Promise.all(
          Object.keys(enrolledClassIds).map(async (classId) => {
            try {
              const classDoc = await getDoc(doc(db, 'classes', classId));
              console.log('Fetched class doc:', classId, classDoc.exists(), classDoc.data()); // Debug log
              if (classDoc.exists()) {
                return { id: classDoc.id, ...classDoc.data() };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching enrolled class ${classId}:`, error);
              return null;
            }
          })
        );
        
        console.log('Enrolled classes before filter:', enrolled); // Debug log
        const filteredEnrolled = enrolled.filter(Boolean);
        console.log('Enrolled classes after filter:', filteredEnrolled); // Debug log
        
        setEnrolledClasses(filteredEnrolled);
      } catch (error) {
        console.error('Error fetching enrolled classes:', error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserClasses:', error);
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
      
      console.log('Creating new class:', newClass);
      const classRef = await addDoc(collection(db, 'classes'), newClass);
      console.log('Class created with ID:', classRef.id);
      
      // Update teacher's classes list - Note the capitalized 'Users'
      await updateDoc(doc(db, 'Users', user.uid), {
        [`classes.${classRef.id}`]: true
      });
      
      await fetchUserClasses();
      return classCode;
    } catch (error) {
      console.error('Error creating class:', error.message);
      throw error;
    }
  };

  // Join a specific teacher's class using code
  const joinClass = async (classCode) => {
    try {
      if (!user) throw new Error('Must be logged in to join a class');

      // Get user data to include name
      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      const userData = userDoc.data();

      const upperClassCode = classCode.toUpperCase();
      console.log('Attempting to join class with code:', upperClassCode);

      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', upperClassCode)
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

      const batch = writeBatch(db);

      // Add student to class's students list with more details
      const classRef = doc(db, 'classes', classId);
      batch.update(classRef, {
        [`students.${user.uid}`]: {
          email: user.email,
          name: userData.name || 'Unknown',
          joinedAt: new Date().toISOString(),
          role: userData.Role
        }
      });

      // Add class to student's enrolledClasses with more details
      const userRef = doc(db, 'Users', user.uid);
      batch.update(userRef, {
        [`enrolledClasses.${classId}`]: {
          joined: new Date().toISOString(),
          className: classData.name,
          teacherEmail: classData.teacherEmail
        }
      });

      await batch.commit();
      console.log('Successfully joined class');
      await fetchUserClasses();
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  };

  const createAssignment = async (classId, assignmentData) => {
    try {
      const assignmentRef = await addDoc(
        collection(db, 'classes', classId, 'assignments'),
        {
          ...assignmentData,
          createdAt: new Date().toISOString(),
          submissions: {}
        }
      );
      return assignmentRef.id;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  };

  const getClassAssignments = async (classId) => {
    try {
      const assignmentsSnapshot = await getDocs(
        collection(db, 'classes', classId, 'assignments')
      );
      return assignmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  };

  const value = {
    userClasses,        // Classes created by teacher
    enrolledClasses,    // Classes joined using code
    loading,
    createClass,
    joinClass,
    fetchUserClasses,
    createAssignment,
    getClassAssignments
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}; 