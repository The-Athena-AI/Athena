"""
may not need depending on how the assignments are stored on the database

id - used to get the actual file from the database
rubricId - used to match up the assignment with its answer key
name - name of the assignment. will likely only be used for front-end stuff
teachers - a list of people who have permission to edit the file

may be added in the future:
something will prob be added to store the questions so we don't need to retrieve them from the database every time
"""

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