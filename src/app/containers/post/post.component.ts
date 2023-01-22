import { Component, OnInit } from '@angular/core';
import {PostModel} from '../../core/models/posts.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsService} from '../../core/http/posts.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  public post: PostModel;

  constructor(public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private postsService: PostsService) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.params.postId;
    this.postsService.getPost(postId).subscribe((res) => {
      this.post = res.post;
      this.incrementViews();
    });
  }

  public navigateToAuthor(): void {
    this.router.navigate(['users', this.post.author.id]).then();
  }

  public incrementViews(): void {
    this.postsService.incrementPostViews(this.post.id).subscribe();
  }
}
