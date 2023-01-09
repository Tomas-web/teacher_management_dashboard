import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingTeacherLessonsComponent } from './upcoming-teacher-lessons.component';

describe('UpcomingTeacherLessonsComponent', () => {
  let component: UpcomingTeacherLessonsComponent;
  let fixture: ComponentFixture<UpcomingTeacherLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingTeacherLessonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingTeacherLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
