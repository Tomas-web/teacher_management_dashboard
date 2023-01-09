import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingStudentLessonsComponent } from './upcoming-student-lessons.component';

describe('UpcomingStudentLessonsComponent', () => {
  let component: UpcomingStudentLessonsComponent;
  let fixture: ComponentFixture<UpcomingStudentLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingStudentLessonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingStudentLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
