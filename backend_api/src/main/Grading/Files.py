class Assignment:
    __slots__ = ["__id", "__classId", "__rubric", "__file"]

    def __init__(self, id, classId, rubric, file):
        self.__id = id
        self.__classId = classId
        self.__rubric = rubric
        self.__file = file

    def get_id(self):
        return self.__id
    def get_classId(self):
        return self.__classId
    def get_rubric(self):
        return self.__rubric
    def get_file(self):
        return self.__file