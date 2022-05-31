import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedHomeworksComponent } from './assigned-homeworks.component';

describe('AssignedHomeworksComponent', () => {
  let component: AssignedHomeworksComponent;
  let fixture: ComponentFixture<AssignedHomeworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedHomeworksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedHomeworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
