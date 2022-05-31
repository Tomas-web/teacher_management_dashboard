import {Injectable} from '@angular/core';
import {HttpClientWrapperService} from './http-client-wrapper.service';
import {Observable} from 'rxjs';
import {UserReviewModel} from '../models/user-review.model';
import {UserModel} from '../models/user.model';
import {UserLessonReservationsModel} from "../models/user-lesson-reservations.model";
import {UserWorkingTimesModel} from "../models/user-working-times.model";

@Injectable({providedIn: 'root'})
export class UsersService {

  constructor(public http: HttpClientWrapperService) {
  }

  public getUserData(userId: string): Observable<UserModel> {
    return this.http.get(`/users/${userId}`);
  }

  public getUserReviews(userId: string): Observable<UserReviewModel[]> {
    return this.http.get(`/users/${userId}/reviews`);
  }

  public saveUserReview(userId: string, value: number, comment: string): Observable<any> {
    return this.http.post(`/users/${userId}/reviews`, {value, comment});
  }

  public getReservedLessons(userId: string): Observable<UserLessonReservationsModel> {
    return this.http.get(`/users/${userId}/reservations`);
  }

  public saveLessonReservation(userId: string, dateTime: string): Observable<any> {
    return this.http.post(`/users/${userId}/reservations`, {dateTime});
  }

  public getWorkingTimes(userId: string): Observable<UserWorkingTimesModel> {
    return this.http.get(`/users/${userId}/working-times`);
  }

  public assignHomework(userId: string, content: string, deadline: string): Observable<any> {
    return this.http.post(`/users/${userId}/homeworks`, {content, deadline});
  }
}
