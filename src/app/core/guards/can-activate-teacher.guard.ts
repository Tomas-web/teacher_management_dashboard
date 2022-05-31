import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {ProfileService} from "../http/profile.service";
import {Observable} from "rxjs";
import {UserRoleEnum} from "../enums/user-role.enum";

@Injectable()
export class CanActivateTeacherGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router,
              private profileService: ProfileService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isTeacher();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isTeacher();
  }

  private isTeacher(): boolean {
    return this.profileService.profile?.roleId === UserRoleEnum.TEACHER;
  }
}
