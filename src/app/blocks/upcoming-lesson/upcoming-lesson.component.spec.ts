import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingLessonComponent } from './upcoming-lesson.component';

describe('UpcomingLessonComponent', () => {
  let component: UpcomingLessonComponent;
  let fixture: ComponentFixture<UpcomingLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingLessonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
