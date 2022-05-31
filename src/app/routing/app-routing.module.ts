import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from '../containers/home/home.component';
import {ProfileComponent} from '../containers/profile/profile.component';
import {NavigationComponent} from '../navigation/navigation.component';
import {AuthorizationComponent} from '../auth/authorization/authorization.component';
import {CanActivateDefaultGuard} from "../core/guards/can-activate-default.guard";
import {UserComponent} from "../containers/user/user.component";
import {NotFoundComponent} from "../not-found/not-found.component";
import {PostComponent} from "../containers/post/post.component";
import {HomeworksComponent} from "../containers/homeworks/homeworks.component";
import {AssignedHomeworksComponent} from "../containers/assigned-homeworks/assigned-homeworks.component";
import {CanActivateTeacherGuard} from "../core/guards/can-activate-teacher.guard";

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        children: [
          {
            path: 'posts/:postId',
            component: PostComponent
          }
        ]
      },
      {
        path: 'homeworks',
        component: HomeworksComponent,
        canActivate: [CanActivateDefaultGuard],
      },
      {
        path: 'assigned-homeworks',
        component: AssignedHomeworksComponent,
        canActivate: [CanActivateDefaultGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [CanActivateDefaultGuard]
      },
      {
        path: 'authorize',
        component: AuthorizationComponent,
      },
      {
        path: 'users/:userId',
        component: UserComponent,
        canActivate: [CanActivateDefaultGuard]
      },
      { path: '**', component: NotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanActivateDefaultGuard, CanActivateTeacherGuard],
})
export class AppRoutingModule { }
