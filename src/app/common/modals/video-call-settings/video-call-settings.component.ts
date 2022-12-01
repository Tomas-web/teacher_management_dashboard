import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import AgoraRTC from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-video-call-settings',
  templateUrl: './video-call-settings.component.html',
  styleUrls: ['./video-call-settings.component.scss']
})
export class VideoCallSettingsComponent implements OnInit {
  @Input() channelParameters: any;

  @Output() audioInputDeviceChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() videoDeviceChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() incomingVolumeChanged: EventEmitter<any> = new EventEmitter<any>();

  selectedAudioInputDevice: string;
  audioInputDevices: any[] = [];
  selectedVideoDevice: string;
  videoDevices: any[] = [];

  constructor(private modalRef: NgbActiveModal) { }

  async ngOnInit(): Promise<any> {
    this.selectedAudioInputDevice = this.channelParameters.localAudioTrack._deviceName;
    this.selectedVideoDevice = this.channelParameters.localVideoTrack._deviceName;
    this.videoDevices = await AgoraRTC.getCameras();
    this.videoDevices = this.videoDevices.filter(as => as.deviceId !== 'default' && as.deviceId !== 'communications');
    this.videoDevices.forEach(device => device.name = device.label);
    this.audioInputDevices = await AgoraRTC.getMicrophones();
    this.audioInputDevices = this.audioInputDevices.filter(as => as.deviceId !== 'default' && as.deviceId !== 'communications');
    this.audioInputDevices.forEach(device => device.name = device.label);
  }

  public dismiss(): void {
    this.modalRef.close();
  }

  selectAudioInputDevice(device: any): void {
    this.channelParameters.localAudioTrack.setDevice(device.deviceId);
    this.selectedAudioInputDevice = device.label;
  }

  selectVideoDevice(device: any): void {
    this.channelParameters.localVideoTrack.setDevice(device.deviceId);
    this.selectedVideoDevice = device.label;
  }

  onRemoteAudioVolumeChange(event: any): void {
    this.channelParameters.remoteAudioTrack.setVolume(parseInt(event.target.value, 10));
  }
}
