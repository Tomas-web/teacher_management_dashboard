import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LessonReservationModel} from "../../core/models/student-lesson-reservation.model";
import {UsersService} from "../../core/http/users.service";
import {Subscription} from "rxjs";
import {UserModel} from "../../core/models/user.model";
import {DateWorkerService} from "../../core/services/date-worker.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upcoming-lesson',
  templateUrl: './upcoming-lesson.component.html',
  styleUrls: ['./upcoming-lesson.component.scss']
})
export class UpcomingLessonComponent implements OnInit, OnDestroy {
  @Input() lessonReservation: LessonReservationModel;
  @Input() showForTeacher: boolean;

  public userData: UserModel;

  private userDataSub: Subscription;

  constructor(public dateWorker: DateWorkerService,
              private router: Router,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.getUserData();
  }

  ngOnDestroy(): void {
    this.unsubUserData();
  }

  public navigateToUser(): void {
    this.router.navigate(['users', this.userData.id]).then();
  }

  private getUserData(): void {
    this.unsubUserData();
    const userId = this.showForTeacher ? this.lessonReservation.studentId : this.lessonReservation.teacherId;
    this.userDataSub = this.usersService.getUserData(userId).subscribe((data) => {
      this.userData = data;
    });
  }

  private unsubUserData(): void {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
      this.userDataSub = null;
    }
  }
}
