import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {DateWorkerService} from '../../core/services/date-worker.service';
import {NgxMatDatetimePicker} from '@angular-material-components/datetime-picker';
import {NgxMatTimepickerComponent} from '@angular-material-components/datetime-picker/lib/timepicker.component';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {
  @Input() minTime: string;
  @Input() maxTime: string;
  @Input() reservedDates: Date[];
  @Input() maxLessonsADay: number;

  @ViewChild('picker') picker: NgxMatDatetimePicker<any>;
  @ViewChild('timePicker') timePicker: NgxMatTimepickerComponent<any>;

  @Output() submitted: EventEmitter<Date> = new EventEmitter<Date>();

  public selectedTime: string;
  public availableTimes = [];
  public disabled = false;
  public minDate = new Date();
  public color: ThemePalette = 'primary';
  public dateInput: Date;
  public dateFilter = (date: Date): boolean => true;

  constructor(public dateWorker: DateWorkerService) {
  }

  ngOnInit(): void {
    this.dateFilter = (date: Date) => {
      const availableTimes = this.getAvailableTimes(date);

      return availableTimes.length > 0;
    };
  }

  public onDatepickerClose(): void {
    this.selectedTime = null;
    if (this.dateInput) {
      this.availableTimes = this.getAvailableTimes(this.dateInput);
    }
  }

  public selectTime(time: string): void {
    if (!this.dateInput) {
      return;
    }

    this.selectedTime = time;
  }

  private getAvailableTimes(date: Date): string[] {
    const currDate = new Date();
    const currHour = currDate.getHours();
    const availableTimes = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const reservedDates = this.reservedDates.filter(d => d.getFullYear() === year && d.getMonth() === month && d.getDate() === day);

    const hourStart = Number(this.minTime.split(':')[0]);
    const minuteStart = Number(this.minTime.split(':')[1]);
    const hourEnd = Number(this.maxTime.split(':')[0]);

    const reservedTimes = [];

    for (const d of reservedDates) {
      const reservedHour = d.getHours();
      reservedTimes.push(`${reservedHour > 9 ? reservedHour : '0' + reservedHour}:${minuteStart > 9 ? minuteStart : '0' + minuteStart}`);
    }

    for (let i = 0; i < hourEnd - hourStart; i++) {
      const time = `${hourStart + i > 9 ? hourStart + i : '0' + (hourStart + i)}:${minuteStart > 9 ? minuteStart : '0' + minuteStart}`;
      if (reservedTimes.includes(time) ||
        (date.getMonth() === currDate.getMonth()
          && date.getDate() === currDate.getDate()
          && (hourStart + i) <= currHour)) {
        continue;
      }

      availableTimes.push(time);
    }

    return availableTimes;
  }

  public submit(): void {
    if (!this.dateInput || !this.selectedTime) {
      return;
    }

    const hours = Number(this.selectedTime.split(':')[0]);
    const minutes = Number(this.selectedTime.split(':')[1]);

    this.submitted.emit(new Date(this.dateInput.getFullYear(), this.dateInput.getMonth(), this.dateInput.getDate(), hours, minutes));

    this.dateInput = null;
    this.selectedTime = null;
  }
}
