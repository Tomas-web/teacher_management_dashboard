import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './containers/home/home.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { HeaderComponent } from './blocks/header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import {AuthService} from './auth/auth.service';
import { AuthorizationComponent } from './auth/authorization/authorization.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TokenInterceptor} from './core/http/token.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadAvatarComponent } from './common/modals/upload-avatar/upload-avatar.component';
import { ImageCropperComponent } from './blocks/image-cropper/image-cropper.component';
import { UserComponent } from './containers/user/user.component';
import { UserReviewComponent } from './blocks/user-review/user-review.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {MbscModule} from '@mobiscroll/angular-lite';
import {
  NgxMatDatetimePickerModule, NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NgxNativeDateModule
} from '@angular-material-components/datetime-picker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import { DateTimePickerComponent } from './blocks/date-time-picker/date-time-picker.component';
import {DateWorkerService} from './core/services/date-worker.service';
import { AvatarComponent } from './blocks/avatar/avatar.component';
import { UpcomingLessonComponent } from './blocks/upcoming-lesson/upcoming-lesson.component';
import { CreatePostComponent } from './common/modals/create-post/create-post.component';
import { DropdownComponent } from './blocks/dropdown/dropdown.component';
import { ActionConfirmationComponent } from './common/modals/action-confirmation/action-confirmation.component';
import { PostCardComponent } from './blocks/post-card/post-card.component';
import { PostComponent } from './containers/post/post.component';
import { HomeworksComponent } from './containers/homeworks/homeworks.component';
import { AssignedHomeworksComponent } from './containers/assigned-homeworks/assigned-homeworks.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import { AssignHomeworkComponent } from './common/modals/assign-homework/assign-homework.component';
import { HomeworksListComponent } from './blocks/homeworks-list/homeworks-list.component';
import { ChatComponent } from './containers/chat/chat.component';
import {NgxAgoraSdkNgModule} from 'ngx-agora-sdk-ng';
import { VideoCallComponent } from './containers/video-call/video-call.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { RootComponent } from './root/root.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VideoCallSettingsComponent } from './common/modals/video-call-settings/video-call-settings.component';
import { DropdownObjectsComponent } from './blocks/dropdown-objects/dropdown-objects.component';
import { VideoCallChatComponent } from './blocks/video-call/video-call-chat/video-call-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    HeaderComponent,
    NavigationComponent,
    AuthorizationComponent,
    UploadAvatarComponent,
    ImageCropperComponent,
    UserComponent,
    UserReviewComponent,
    NotFoundComponent,
    DateTimePickerComponent,
    AvatarComponent,
    UpcomingLessonComponent,
    CreatePostComponent,
    DropdownComponent,
    ActionConfirmationComponent,
    PostCardComponent,
    PostComponent,
    HomeworksComponent,
    AssignedHomeworksComponent,
    AssignHomeworkComponent,
    HomeworksListComponent,
    ChatComponent,
    VideoCallComponent,
    DashboardComponent,
    RootComponent,
    VideoCallSettingsComponent,
    DropdownObjectsComponent,
    VideoCallChatComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MbscModule,
    NgxMatDatetimePickerModule,
    NgxNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatNativeDateModule,
    BrowserAnimationsModule,
    NgxMatTimepickerModule,
    NgApexchartsModule,
    NgxAgoraSdkNgModule.forRoot({
      AppID: '80a258d7505b4ef2bfd57a9aef607545',
      Video: { codec: 'h264', mode: 'rtc', role: 'host' }
    }),
    FontAwesomeModule
  ],
  providers: [
    AuthService,
    DateWorkerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
