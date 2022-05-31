export interface StudentLessonReservationModel {
  lessonReservations: LessonReservationModel[];
}

export interface LessonReservationModel {
  teacherId: string;
  studentId: string;
  lessonStart: string;
  lessonEnd: string;
}
