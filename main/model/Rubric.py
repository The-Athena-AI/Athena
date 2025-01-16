"""
may not need depending on how the rubrics are stored on the database

id - used to get the actual file from the database
assigmentId - used to match up the answer key with its assignment
name - name of the assignment. will likely only be used for front-end stuff
teachers - a list of people who have permission to edit the file

may be added in the future:
something will prob be added to store the answers so we don't need to retrieve them from the database every time
"""

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