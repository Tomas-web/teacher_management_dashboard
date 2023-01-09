import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../core/http/profile.service';
import {UsersService} from '../../core/http/users.service';
import {LessonReservationModel} from '../../core/models/student-lesson-reservation.model';

@Component({
  selector: 'app-upcoming-teacher-lessons',
  templateUrl: './upcoming-teacher-lessons.component.html',
  styleUrls: ['./upcoming-teacher-lessons.component.scss']
})
export class UpcomingTeacherLessonsComponent implements OnInit {

  teacherLessonReservations: LessonReservationModel[];
  constructor(
    private profileService: ProfileService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    if (!this.profileService.profile) {
      this.profileService.getProfileData().subscribe((profile) => {
        this.profileService.profile = profile;
        this.getLessonReservationForTeacher();
      });
    } else {
      this.getLessonReservationForTeacher();
    }
  }

  private getLessonReservationForTeacher(): void {
    this.usersService.getReservedLessons(this.profileService.profile.id).subscribe((res) => {
      this.teacherLessonReservations = res.lessonReservations;
    });
  }
}
