class Class:
    __slots__ = ["__id", "__name", "__students", "__teachers", "__assignments"]

    def __init__(self, id, name, teacher):
        self.__id = id
        self.__name = name
        self.__students = []
        self.__teachers = [teacher]
        self.__assignments = []

    def get_id(self):
        return self.__id
    def get_name(self):
        return self.__name
    def get_students(self):
        return self.__students
    def get_teachers(self):
        return self.__teachers
    def get_assignments(self):
        return self.__assignments
    
    def add_student(self, student_id):
        self.__students.append(student_id)
    def add_teacher(self, teacher_id):
        self.__teachers.append(teacher_id)
    def add_assignment(self, assignment):
        self.__assignments.append(assignment)
    
    def remove_student(self, student_id):
        self.__students.remove(student_id)
    def remove_teacher(self, teacher_id):
        self.__teachers.remove(teacher_id)
    def remove_assignment(self, assignment):
        self.__assignments.remove(assignment)

class Student:
    __slots__ = []

    def __init__(self):
        pass

class Teacher:
    __slots__ = []

    def __init__(self):
        pass