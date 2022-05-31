import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              public auth: AuthService) { }

  ngOnInit(): void {
    if (this.route.snapshot.fragment) {
      this.auth.handleAuthentication();
    }
    this.router.navigate(['home']).then();
  }

}
