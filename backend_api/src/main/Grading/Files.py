class Assignment:
    __slots__ = ["__id", "__rubricId", "__name", "__teachers", "__file"]

    def __init__(self, id, rubricId, name, teacher, file):
        self.__id = id
        self.__rubricId = rubricId
        self.__name = name
        self.__teachers = [teacher]
        self.__file = file

    def get_id(self):
        return self.__id
    def get_rubricId(self):
        return self.__rubricId
    def get_name(self):
        return self.__name
    def get_teachers(self):
        return self.__teachers
    def get_file(self):
        return self.__file

    def add_teacher(self, teacher_id):
        self.__teachers.append(teacher_id)
    def remove_teacher(self, teacher_id):
        self.__teachers.remove(teacher_id)


class Rubric:
    __slots__ = ["__id", "__assignmentId", "__name", "__teachers", "__file"]

    def __init__(self, id, assignmentId, name, teacher, file):
        self.__id = id
        self.__assignmentId = assignmentId
        self.__name = name
        self.__teachers = [teacher]
        self.__file = file

    def get_id(self):
        return self.__id
    def get_assignmentId(self):
        return self.__assignmentId
    def get_name(self):
        return self.__name
    def get_teachers(self):
        return self.__teachers
    def get_file(self):
        return self.__file

    def add_teacher(self, teacher_id):
        self.__teachers.append(teacher_id)
    def remove_teacher(self, teacher_id):
        self.__teachers.remove(teacher_id)