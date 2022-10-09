import {Injectable} from '@angular/core';
import {HttpClientWrapperService} from './http-client-wrapper.service';
import {Observable, of, Subject} from 'rxjs';
import {ProfileModel} from '../models/profile.model';
import {UpdateProfileModel} from '../models/update-profile.model';
import {StudentLessonReservationModel} from "../models/student-lesson-reservation.model";
import {PostResponseModel} from "../models/posts.model";
import {HomeworksResponseModel} from "../models/homeworks-response.model";
import {ProfileStudentsResponseModel} from "../models/profile-students-response.model";
import {PostViewsResponseModel} from "../models/post-views.model";

@Injectable({providedIn: 'root'})
export class ProfileService {
  public profile: ProfileModel;
  public profileSubject$: Subject<ProfileModel> = new Subject<ProfileModel>();

  private requestingData: boolean;
  constructor(private httpWrapper: HttpClientWrapperService) {}

  public getProfileData(
    freshData?: boolean
  ): Observable<ProfileModel> {
    if (!freshData && this.profile) {
      return of(this.profile);
    }

    this.profileSubject$.isStopped = false;
    if (!this.requestingData) {
      this.requestProfile();
    }

    return this.profileSubject$.asObservable();
  }

  public getProfile(): Observable<ProfileModel> {
    return this.httpWrapper.get(`/profile`);
  }

  public updateProfile(data: UpdateProfileModel): Observable<any> {
    return this.httpWrapper.put(`/profile`, data);
  }

  public uploadAvatar(image: Blob | File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', image, 'image');
    return this.httpWrapper.post(`/profile/picture`, formData, {
      headers: { 'Content-Type': undefined },
    });
  }

  public getLessonsReservations(): Observable<StudentLessonReservationModel> {
    return this.httpWrapper.get(`/profile/lesson-reservations`);
  }

  public getPost(): Observable<PostResponseModel> {
    return this.httpWrapper.get(`/profile/post`);
  }

  public getStudentHomeworks(listType: string): Observable<HomeworksResponseModel> {
    return this.httpWrapper.get(`/profile/homeworks/student?list_type=${listType}`);
  }

  public getHomeworksForTeacher(listType: string): Observable<HomeworksResponseModel> {
    return this.httpWrapper.get(`/profile/homeworks/teacher?list_type=${listType}`);
  }

  public getStudents(q: string): Observable<ProfileStudentsResponseModel> {
    return this.httpWrapper.get(`/profile/students?q=${q}`);
  }

  public getPostViews(period: string): Observable<PostViewsResponseModel> {
    return this.httpWrapper.get(`/profile/post-views?period=${period}`);
  }

  private requestProfile(): void {
    this.requestingData = true;
    this.getProfile().subscribe((data) => {
      this.profile = data;
      this.profileSubject$.next(data);
      this.profileSubject$.complete();
      this.requestingData = false;
    });
  }
}
