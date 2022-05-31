import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PostModel} from "../../core/models/posts.model";

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  @Input() post: PostModel;

  @Output() postClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public onClickPost(): void {
    this.postClicked.emit(this.post.id);
  }
}
