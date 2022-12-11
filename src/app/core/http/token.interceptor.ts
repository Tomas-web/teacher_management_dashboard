import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public cookieService: CookieService,
              public auth: AuthService,
              public router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = { 'Content-Type': 'application/json' };
    const token =
      this.cookieService.get('token') ||
      window.localStorage.getItem('access_token');
    if (token) {
      Object.assign(headers, { Authorization: `Bearer ${token}` });
    }
    if (req.body instanceof FormData) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    } else if (req.url.includes('download')) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
    } else {
      req = req.clone({
        setHeaders: headers,
      });
    }

    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          this.auth.logout();
          this.router.navigateByUrl('/login', {});
        }
        return throwError(err);
      })
    );
  }

}
