import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ProfileService} from '../core/http/profile.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(public profileService: ProfileService,
              public auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.getProfileData().subscribe((profile) => {
        this.profileService.profile = profile;
      });
    } else {
      this.profileService.profile = null;
    }
  }

  public onClickLogin(): void {
    this.auth.login();
  }

  public logout(): void {
    this.auth.logout();
  }
}
