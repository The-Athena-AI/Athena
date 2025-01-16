"""may not need depending on how the rubrics are stored on the database"""

class Rubric:
    __slots__ = ["__id", "__assignmentId", "__name", "__teachers"]

    def __init__(self, id, assignmentId, name, teacher):
        self.__id = id
        self.__assignmentId = assignmentId
        self.__name = name
        self.__teachers = [teacher]

    def get_id(self):
        return self.__id
    def get_assignmentId(self):
        return self.__assignmentId
    def get_name(self):
        return self.__name
    def get_teachers(self):
        return self.__teachers
    
    def add_teacher(self, teacher_id):
        self.__teachers.append(teacher_id)
    def remove_teacher(self, teacher_id):
        self.__teachers.remove(teacher_id)