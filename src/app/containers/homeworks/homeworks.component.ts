import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../core/http/profile.service';
import {Homework} from '../../core/models/homeworks-response.model';

@Component({
  selector: 'app-homeworks',
  templateUrl: './homeworks.component.html',
  styleUrls: ['./homeworks.component.scss']
})
export class HomeworksComponent implements OnInit {
  public homeworks: Homework[];

  public selectedListType: string;
  public readonly listTypes = ['All', 'Upcoming'];

  constructor(private profileService: ProfileService) {
    this.selectedListType = this.listTypes[0];
  }

  ngOnInit(): void {
    this.getHomeworks();
  }

  public selectListType(type: string): void {
    this.selectedListType = type;
    this.getHomeworks();
  }

  public getHomeworks(): void {
    this.homeworks = null;
    this.profileService.getStudentHomeworks(this.selectedListType).subscribe((res) => {
      this.homeworks = res.homeworks;
    });
  }
}
