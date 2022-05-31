import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../../core/http/profile.service';
import {Homework} from '../../core/models/homeworks-response.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AssignHomeworkComponent} from '../../common/modals/assign-homework/assign-homework.component';

@Component({
  selector: 'app-assigned-homeworks',
  templateUrl: './assigned-homeworks.component.html',
  styleUrls: ['./assigned-homeworks.component.scss']
})
export class AssignedHomeworksComponent implements OnInit {
  public homeworks: Homework[];

  public showHomeworkAssigned: boolean;
  public selectedListType: string;
  public readonly listTypes = ['All', 'Upcoming'];

  private modalRef: NgbModalRef;

  constructor(private profileService: ProfileService,
              private modalService: NgbModal) {
    this.selectedListType = this.listTypes[0];
  }

  ngOnInit(): void {
    this.getHomeworks();
  }

  public selectListType(type: string): void {
    this.selectedListType = type;
    this.getHomeworks();
  }

  public openAssignHomeworkModal(): void {
    this.modalRef = this.modalService.open(AssignHomeworkComponent, {
      centered: true,
      size: 'lg',
    });

    this.modalRef.componentInstance.onSubmit.subscribe(() => {
      this.getHomeworks();
      this.showHomeworkAssigned = true;
      setTimeout(() => {
        this.showHomeworkAssigned = false;
      }, 10000);
      this.modalRef.dismiss();
    });
  }

  private getHomeworks(): void {
    this.homeworks = null;
    this.profileService.getHomeworksForTeacher(this.selectedListType).subscribe((res) => {
      this.homeworks = res.homeworks;
    });
  }
}
