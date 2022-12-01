import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {ProfileService} from '../http/profile.service';
import {ProfileModel} from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<ProfileModel> {
  constructor(private profileService: ProfileService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProfileModel> {
    return this.profileService.getProfile();
  }
}
