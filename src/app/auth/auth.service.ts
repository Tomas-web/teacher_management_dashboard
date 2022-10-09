import {Injectable} from '@angular/core';
import * as auth0 from 'auth0-js';
import {AUTH_CONFIG} from './auth0-variabled';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ProfileService} from "../core/http/profile.service";

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile email',
  });

  public authenticating = false;
  public authChecked = false;

  constructor(private cookieService: CookieService,
              private router: Router,
              private profileService: ProfileService) {
  }

  public login(): void {
    console.log('login');
    this.authChecked = false;
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.profileService.getProfileData(true).subscribe((profile) => {
          this.profileService.profile = profile;
          this.router.navigate(['home']);
        });
      } else if (err) {
        this.router.navigate(['home']);
        console.log(err);
      }
      this.authChecked = true;
    });
  }

  public logout(): void {
    this.profileService.profile = null;
    // Remove tokens and expiry time from localStorage
    localStorage.clear();
    this.cookieService.deleteAll('/');

    this.auth0.logout({
      returnTo: AUTH_CONFIG.logoutCallbackURL,
      clientID: AUTH_CONFIG.clientID,
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    if (new Date().getTime() < expiresAt) {
      this.setTokenCookie(
        localStorage.getItem('access_token'),
        new Date(expiresAt)
      );
      return true;
    }
    return false;
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.setTokenCookie(authResult.accessToken, new Date(expiresAt));
  }

  private setTokenCookie(token: string, expiresAt: Date): void {
    this.cookieService.set('token', token, expiresAt, '/', null, true, 'None');
  }
}
