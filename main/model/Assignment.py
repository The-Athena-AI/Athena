"""may not need depending on how the assignments are stored on the database"""

class Assignment:
    __slots__ = ["__id", "__rubricId", "__name", "__teachers"]

    def __init__(self, id, rubricId, name, teacher):
        self.__id = id
        self.__rubricId = rubricId
        self.__name = name
        self.__teachers = [teacher]

    def get_id(self):
        return self.__id
    def get_rubricId(self):
        return self.__rubricId
    def get_name(self):
        return self.__name
    def get_teachers(self):
        return self.__teachers
    
    def add_teacher(self, teacher_id):
        self.__teachers.append(teacher_id)
    def remove_teacher(self, teacher_id):
        self.__teachers.remove(teacher_id)