import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {NotFoundComponent} from '../not-found/not-found.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService) { }

  ngOnInit(): void {
    if (this.route.children.length > 0 && this.route.firstChild.component !== NotFoundComponent) {
      return;
    }

    this.router.navigate(['home']).then();
  }

}
