import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../core/http/users.service';
import {Subscription} from 'rxjs';
import {UserModel} from '../../core/models/user.model';
import {UserReviewModel} from '../../core/models/user-review.model';
import {ActivatedRoute} from '@angular/router';
import {UserRoleEnum} from '../../core/enums/user-role.enum';
import {AuthService} from '../../auth/auth.service';
import {DateWorkerService} from '../../core/services/date-worker.service';
import {ProfileService} from "../../core/http/profile.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  public userId: string;
  public user: UserModel;
  public reviews: UserReviewModel[];
  public selectedRating = 0;
  public ratingRequired: boolean;
  public submittingReview: boolean;

  public maxReviewCommentLength = 500;

  public workingTimeStart: string;
  public workingTimeEnd: string;
  public maxLessonsADay: number;
  public reservationSuccessful = false;

  public lessonReservations: Date[] = [];
  public isReservedByOtherUser: boolean;
  public timeConflicts: boolean;

  public userRoleEnum = UserRoleEnum;
  public reviewText = '';

  private submittingReservation: boolean;
  private userDataSub: Subscription;
  constructor(public auth: AuthService,
              public profileService: ProfileService,
              public dateWorker: DateWorkerService,
              private route: ActivatedRoute,
              private usersService: UsersService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.userId;
    this.getUserData();
    this.getUserReviews();
    this.getReservedLessonDates();
    this.getWorkingTimes();
  }

  ngOnDestroy(): void {
    this.unsubUserData();
  }

  public onClickStar(ratingValue: number): void {
    this.selectedRating = ratingValue;
  }

  public saveReview(): void {
    if (this.submittingReview || this.reviewText.length > this.maxReviewCommentLength) {
      return;
    }

    if (this.selectedRating === 0) {
      this.ratingRequired = true;
      return;
    }

    this.ratingRequired = false;
    this.submittingReview = true;
    this.usersService.saveUserReview(this.userId, this.selectedRating, this.reviewText).subscribe(() => {
      this.selectedRating = 0;
      this.reviewText = '';
      this.submittingReview = false;
      this.getUserReviews();
    }, () => {
      this.submittingReview = false;
    });
  }

  public submitReservation(date: Date): void {
    this.timeConflicts = false;
    this.isReservedByOtherUser = false;
    if (this.submittingReservation) {
      return;
    }

    this.submittingReservation = true;
    this.usersService.saveLessonReservation(this.userId, date.toISOString()).subscribe(() => {
      this.lessonReservations.push(date);
      this.reservationSuccessful = true;
      this.submittingReservation = false;

      setTimeout(() => {
        this.reservationSuccessful = false;
      }, 1500);
    }, error => {
      this.submittingReservation = false;

      if (error.status === 409) {
        this.timeConflicts = true;
      } else if (error.status === 400) {
        this.isReservedByOtherUser = true;
        this.getReservedLessonDates();
      }
    });
  }

  private getReservedLessonDates(): void {
    this.lessonReservations = [];
    this.usersService.getReservedLessons(this.userId).subscribe((res) => {
      res.lessonReservations.forEach(reservation => {
        this.lessonReservations.push(new Date(reservation.lessonStart));
      });
    });
  }

  private getUserData(): void {
    this.userDataSub = this.usersService
      .getUserData(this.userId)
      .subscribe((user) => {
        this.user = user;
    });
  }

  private getUserReviews(): void {
    this.usersService
      .getUserReviews(this.userId)
      .subscribe((reviews) => {
        this.reviews = reviews;
    });
  }

  private getWorkingTimes(): void {
    this.usersService.getWorkingTimes(this.userId).subscribe((res) => {
      this.workingTimeStart = this.dateWorker.convertUTCTime(res.timeStart);
      this.workingTimeEnd = this.dateWorker.convertUTCTime(res.timeEnd);
      const start = Number(this.workingTimeStart.split(':')[0]);
      const end = Number(this.workingTimeEnd.split(':')[0]);
      this.maxLessonsADay = end - start;
    });
  }

  private unsubUserData(): void {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
      this.userDataSub = null;
    }
  }
}
