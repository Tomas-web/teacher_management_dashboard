import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallSettingsComponent } from './video-call-settings.component';

describe('VideoCallSettingsComponent', () => {
  let component: VideoCallSettingsComponent;
  let fixture: ComponentFixture<VideoCallSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoCallSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCallSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
