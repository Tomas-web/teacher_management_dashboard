import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownObjectsComponent } from './dropdown-objects.component';

describe('DropdownObjectsComponent', () => {
  let component: DropdownObjectsComponent;
  let fixture: ComponentFixture<DropdownObjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownObjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
