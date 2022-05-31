import {Component, Input, OnInit} from '@angular/core';
import {UserReviewModel} from "../../core/models/user-review.model";

@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.scss']
})
export class UserReviewComponent implements OnInit {
  @Input() userId: string;
  @Input() review: UserReviewModel;

  constructor() { }

  ngOnInit(): void {
  }

}
