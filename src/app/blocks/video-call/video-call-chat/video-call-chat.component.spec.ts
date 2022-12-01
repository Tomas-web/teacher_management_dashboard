import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallChatComponent } from './video-call-chat.component';

describe('VideoCallChatComponent', () => {
  let component: VideoCallChatComponent;
  let fixture: ComponentFixture<VideoCallChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoCallChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCallChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
