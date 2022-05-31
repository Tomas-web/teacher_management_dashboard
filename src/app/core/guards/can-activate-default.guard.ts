import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class CanActivateDefaultGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loggedInCheck();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loggedInCheck();
  }

  private loggedInCheck(): boolean {
    const checkToken = this.auth.isAuthenticated();
    if (!checkToken) {
      this.auth.logout();
      this.router.navigate(['home']).then();
    }
    return checkToken;
  }
}
