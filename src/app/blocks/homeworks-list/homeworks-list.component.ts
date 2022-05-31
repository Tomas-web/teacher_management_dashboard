import {Component, Input, OnInit} from '@angular/core';
import {Homework} from "../../core/models/homeworks-response.model";
import {DateWorkerService} from "../../core/services/date-worker.service";

@Component({
  selector: 'app-homeworks-list',
  templateUrl: './homeworks-list.component.html',
  styleUrls: ['./homeworks-list.component.scss']
})
export class HomeworksListComponent implements OnInit {
  @Input() homeworks: Homework[];
  @Input() forTeacher?: boolean;

  public selectedHomework: Homework;

  constructor(public dateWorker: DateWorkerService) { }

  ngOnInit(): void {
  }

  public selectHomework(homework: Homework): void {
    this.selectedHomework = homework;
  }
}
