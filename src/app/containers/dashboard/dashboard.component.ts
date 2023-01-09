import { Component, OnInit } from '@angular/core';
import {UserRoleEnum} from '../../core/enums/user-role.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '../../core/http/profile.service';
import {faUser, faBook, faBookOpen, faComments, faChalkboardTeacher} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public userRolesEnum = UserRoleEnum;
  faUser = faUser;
  faBook = faBook;
  faBookOpen = faBookOpen;
  faComments = faComments;
  faChalkboardTeacher = faChalkboardTeacher;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      this.profileService.profile = res;
    });

    if (this.route.firstChild) {
      return;
    }

    this.router.navigate(['profile'], {relativeTo: this.route}).then();
  }

}
