import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {ProfileService} from "../core/http/profile.service";
import {NotFoundComponent} from "../not-found/not-found.component";
import {UserRoleEnum} from "../core/enums/user-role.enum";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public userRoleEnum = UserRoleEnum;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public profileService: ProfileService,
              public auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.getProfileData().subscribe((profile) => {
        this.profileService.profile = profile;
      });
    } else {
      this.profileService.profile = null;
    }

    if (this.route.firstChild && this.route.firstChild.component !== NotFoundComponent) {
      return;
    }

    this.router.navigate(['home']).then();
  }

  public onClickLogin(): void {
    this.auth.login();
  }

  public logout(): void {
    this.auth.logout();
  }
}
