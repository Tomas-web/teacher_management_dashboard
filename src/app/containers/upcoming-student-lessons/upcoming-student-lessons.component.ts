import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../core/http/profile.service';
import {LessonReservationModel} from '../../core/models/student-lesson-reservation.model';

@Component({
  selector: 'app-upcoming-student-lessons',
  templateUrl: './upcoming-student-lessons.component.html',
  styleUrls: ['./upcoming-student-lessons.component.scss']
})
export class UpcomingStudentLessonsComponent implements OnInit {
  studentLessonReservations: LessonReservationModel[];
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getLessonReservationForStudent();
  }

  private getLessonReservationForStudent(): void {
    this.profileService.getLessonsReservations().subscribe((res) => {
      this.studentLessonReservations = res.lessonReservations;
    });
  }
}
