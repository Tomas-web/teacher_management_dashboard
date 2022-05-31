import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ProfileService} from "../../../core/http/profile.service";
import {UserModel} from "../../../core/models/user.model";
import {Subscription} from "rxjs";
import {UsersService} from "../../../core/http/users.service";
import {DateWorkerService} from "../../../core/services/date-worker.service";

@Component({
  selector: 'app-assign-homework',
  templateUrl: './assign-homework.component.html',
  styleUrls: ['./assign-homework.component.scss']
})
export class AssignHomeworkComponent implements OnInit, OnDestroy {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  public students: UserModel[];

  public studentIdx = 0;
  public studentSearchText = '';
  public showStudents: boolean;
  public preventHideStudents: boolean;
  public searching = true;
  public selectedStudent: UserModel;
  public taskDescription = '';
  public selectedDate: Date;

  public selectDateErr: boolean;
  public selectStudentErr: boolean;
  public emptyDescriptionErr: boolean;
  public submitting: boolean;

  private studentsSub: Subscription;
  constructor(public dateWorker: DateWorkerService,
              private modalRef: NgbActiveModal,
              private profileService: ProfileService,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.getStudents();
  }

  ngOnDestroy(): void {
    this.unsubStudents();
  }

  public moveInStudentsList(event: any): void {
    const scroll = document.getElementById('students-list');
    if (
      event.code === 'ArrowDown' &&
      this.studentIdx < this.students.length - 1
    ) {
      scroll.scrollTop = scroll.scrollTop + 48;
      this.studentIdx++;
    } else if (
      event.code === 'ArrowUp' &&
      this.studentIdx > 0
    ) {
      scroll.scrollTop = scroll.scrollTop - 48;
      this.studentIdx--;
    } else if (event.code === 'Enter') {
      if (this.students.length > 0) {
        this.selectStudent(
          this.students[this.studentIdx]
        );
      }
    }
  }

  public showStudentsList(): void {
    this.preventHideStudents = true;
    this.showStudents = true;
  }

  public selectStudent(student: UserModel): void {
    this.selectedStudent = student;
    this.studentIdx = 0;
    this.studentSearchText = '';
  }

  public unselectStudent(): void {
    this.selectedStudent = null;
    this.getStudents();
  }

  public hideStudentsList(): void {
    if (this.preventHideStudents) {
      this.preventHideStudents = false;
      return;
    }

    this.showStudents = false;
  }

  public handleDateTimeSubmit(value: Date): void {
    this.selectedDate = value;
  }

  public unselectDate(): void {
    this.selectedDate = null;
  }

  public assign(): void {
    this.emptyDescriptionErr = false;
    this.selectStudentErr = false;
    this.selectDateErr = false;
    if (!this.selectedStudent) {
      this.selectStudentErr = true;
    }

    if (this.taskDescription.length === 0) {
      this.emptyDescriptionErr = true;
    }

    if (!this.selectedDate) {
      this.selectDateErr = true;
    }

    if (this.emptyDescriptionErr || this.selectStudentErr || this.selectDateErr) {
      return;
    }

    this.submitting = true;
    this.usersService.assignHomework(this.selectedStudent.id, this.taskDescription, this.selectedDate.toISOString()).subscribe(() => {
      this.submitting = false;
      this.onSubmit.emit();
    });
  }

  public dismiss(): void {
    this.modalRef.close();
  }

  public getStudents(): void {
    this.unsubStudents();
    this.studentIdx = 0;
    this.searching = true;
    this.profileService.getStudents(this.studentSearchText).subscribe((res) => {
      this.students = res.students;
      this.searching = false;
    });
  }

  private unsubStudents(): void {
    if (this.studentsSub) {
      this.studentsSub.unsubscribe();
      this.studentsSub = null;
    }
  }
}
