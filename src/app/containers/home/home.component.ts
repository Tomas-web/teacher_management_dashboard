import {Component, OnInit} from '@angular/core';
import {PostsService} from '../../core/http/posts.service';
import {PostModel} from '../../core/models/posts.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CreatePostComponent} from '../../common/modals/create-post/create-post.component';
import {SpecialitiesService} from '../../core/http/specialities.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {ProfileService} from '../../core/http/profile.service';
import {UserRoleEnum} from '../../core/enums/user-role.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public posts: PostModel[];
  public currentPage = 1;
  public totalPages = 1;
  public pagesList = [];
  public lowestPrice = 1;
  public highestPrice = 50;

  public specialities = ['Any'];
  public selectedSpeciality = 'Any';

  public ratings = ['Any', '1', '2', '3', '4', '5'];
  public selectedRating = 'Any';

  public sortByList = ['Newest', 'Oldest'];
  public selectedSortBy = 'Newest';
  public searchString: string;
  public pricesErr: boolean;
  public showPostCreated: boolean;
  public hidePostsList: boolean;

  public userRoleEnum = UserRoleEnum;

  public modalRef: NgbModalRef;

  constructor(public profileService: ProfileService,
              public auth: AuthService,
              private postsService: PostsService,
              private specialitiesService: SpecialitiesService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.searchPosts();
    this.getSpecialities();
  }

  public handlePostClick(id: string): void {
    this.router.navigate(['posts', id], {relativeTo: this.route}).then();
  }

  public openCreatePostModal(): void {
    this.modalRef = this.modalService.open(CreatePostComponent, {
      centered: true,
      size: 'lg',
    });

    this.modalRef.componentInstance.onSubmit.subscribe(() => {
      this.searchPosts();
      this.showPostCreated = true;
      setTimeout(() => {
        this.showPostCreated = false;
      }, 10000);
      this.modalRef.dismiss();
    });
  }

  public selectRating(value: string): void {
    this.selectedRating = value;
  }

  public selectSpeciality(value: string): void {
    this.selectedSpeciality = value;
  }

  public selectSortBy(value: string): void {
    this.selectedSortBy = value;
  }

  public validateLowestPrice(): void {
    if (this.isPositiveNumber(this.lowestPrice)) {
      return;
    }

    this.lowestPrice = 1;
  }

  public validateHighestPrice(): void {
    if (this.isPositiveNumber(this.highestPrice)) {
      return;
    }

    this.highestPrice = 1;
  }

  public isPositiveNumber(value: number): boolean {
    return value > 0;
  }

  public onPageClicked(value: number): void {
    if (value === this.currentPage) {
      return;
    }

    this.currentPage = value;
    this.searchPosts();
  }

  public onSearchClicked(): void {
    this.currentPage = 1;
    this.searchPosts();
  }

  public searchPosts(): void {
    this.pricesErr = false;
    if (this.lowestPrice > this.highestPrice) {
      this.pricesErr = true;
      return;
    }

    this.posts = null;
    this.pagesList = [];
    this.postsService.getPosts(
      this.currentPage,
      this.lowestPrice,
      this.highestPrice,
      this.selectedSortBy.toLowerCase(),
      this.selectedRating !== 'Any' ? Number(this.selectedRating) : null,
      this.selectedSpeciality !== 'Any' ? this.selectedSpeciality : null,
      this.searchString
    ).subscribe((res) => {
      this.posts = res.posts;
      this.totalPages = res.totalPages;

      for (let i = 1; i <= res.totalPages; i++) {
        this.pagesList.push(i);
      }
    });
  }

  private getSpecialities(): void {
    this.specialitiesService.getSpecialities().subscribe((res) => {
      res.forEach(speciality => this.specialities.push(speciality));
    });
  }
}
