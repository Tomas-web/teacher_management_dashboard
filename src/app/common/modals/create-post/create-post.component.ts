import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../../../core/http/posts.service";
import {PostModel} from "../../../core/models/posts.model";
import {ProfileService} from "../../../core/http/profile.service";
import {ActionConfirmationComponent} from "../action-confirmation/action-confirmation.component";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  public createPostForm: FormGroup;
  public maxTitleLength = 50;
  public maxAboutLength = 1000;
  public submitting: boolean;

  public userPost: PostModel;

  public modalRef: NgbModalRef;
  constructor(private activeModal: NgbActiveModal,
              private postsService: PostsService,
              private profileService: ProfileService,
              private modalService: NgbModal) {
    this.createPostForm = new FormGroup({
      title: new FormControl('', Validators.required),
      about: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getCurrentPost();
  }

  public getCurrentPost(): void {
    this.profileService.getPost().subscribe((res) => {
      this.userPost = res.post;
    });
  }

  public create(): void {
    if (this.submitting ||
      this.createPostForm.invalid ||
      this.title.value.length > this.maxTitleLength ||
      this.about.value > this.maxAboutLength) {
      return;
    }

    if (!!this.userPost) {
      this.showWarning();
      return;
    }

    this.submitting = true;
    this.postsService.createPost(this.title.value, this.about.value).subscribe(() => {
      this.onSubmit.emit();
      this.submitting = false;
    });
  }

  get title(): AbstractControl {
    return this.createPostForm.controls.title;
  }

  get about(): AbstractControl {
    return this.createPostForm.controls.about;
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  private showWarning(): void {
    this.modalRef = this.modalService.open(ActionConfirmationComponent, {
      centered: true,
      size: 'lg',
    });

    this.modalRef.componentInstance.description = 'If you proceed with this action, your previous post will be deleted.';

    this.modalRef.componentInstance.onSubmit.subscribe(() => {
      this.modalRef.dismiss();
      this.submitting = true;
      this.postsService.createPost(this.title.value, this.about.value).subscribe(() => {
        this.onSubmit.emit();
        this.submitting = false;
      });
    });
  }
}
