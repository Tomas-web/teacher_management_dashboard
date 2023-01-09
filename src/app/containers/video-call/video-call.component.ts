import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import AgoraRTC, {IAgoraRTCClient, IRemoteAudioTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import {AgoraTokenService} from '../../core/http/agora-token.service';
import {ProfileService} from '../../core/http/profile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CallsService} from '../../core/http/calls.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {VideoCallSettingsComponent} from '../../common/modals/video-call-settings/video-call-settings.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit, AfterViewInit {
  @ViewChild('localPlayerContainer') localPlayerContainer: ElementRef;
  @ViewChild('remotePlayerContainer') remotePlayerContainer: ElementRef;

  options =
    {
      // Pass your App ID here.
      appId: environment.agora_app_id,
      // Set the channel name.
      channel: '',
      // Pass your temp token here.
      token: '',
      // Set the user ID.
      uid: 0,
    };

  channelParameters: {
    localAudioTrack: any,
    localVideoTrack: any,
    remoteAudioTrack: IRemoteAudioTrack,
    remoteVideoTrack: IRemoteVideoTrack,
    remoteUid: any,
    screenTrack: any,
  } =
    {
      // A variable to hold a local audio track.
      localAudioTrack: null,
      // A variable to hold a local video track.
      localVideoTrack: null,
      // A variable to hold a remote audio track.
      remoteAudioTrack: null,
      // A variable to hold a remote video track.
      remoteVideoTrack: null,
      // A variable to hold the remote user id.s
      remoteUid: null,
      screenTrack: null,
    };

  isSharingEnabled = false;
  isMuteVideo = false;
  isMutedMic = false;

  isChatOpened = false;
  remoteUserOnCall: boolean;

  targetUserId: string;

  isCallInvalid = false;
  isCallStarted = false;

  private modalRef: NgbModalRef;
  private agoraEngine: IAgoraRTCClient;
  private callerId: string;

  constructor(private agoraTokenService: AgoraTokenService,
              private profileService: ProfileService,
              private route: ActivatedRoute,
              private callsService: CallsService,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.targetUserId = this.route.snapshot.params.userId;
  }

  ngAfterViewInit(): void {
    this.profileService.getProfileData().subscribe(() => {
      this.options.channel = this.route.snapshot.queryParams.name;
      this.options.token = this.route.snapshot.queryParams.token;
      this.callerId = this.route.snapshot.queryParams.callerId;

      this.callsService.validateCallRoom(this.callerId, this.targetUserId, this.options.token, this.options.channel).subscribe(() => {
        this.isCallInvalid = false;
        this.startBasicCall();
        this.joinCall();
        this.isCallStarted = true;
      }, () => {
        this.isCallInvalid = true;
      });
    });
  }

  startBasicCall(): void {
    // Create an instance of the Agora Engine

    this.agoraEngine = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
    AgoraRTC.onAutoplayFailed = () => {
      // Create button for the user interaction.
      const btn = document.createElement('button');
      // Set the button text.
      btn.innerText = 'Click me to resume the audio/video playback';
      // Remove the button when onClick event occurs.
      btn.onclick = () => {
        btn.remove();
      };
      // Append the button to the UI.
      document.body.append(btn);
    };

    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
      // When plugging in a device, switch to a device that is newly plugged in.
      if (changedDevice.state === 'ACTIVE') {
        this.channelParameters.localAudioTrack.setDevice(changedDevice.device.deviceId);
        // Switch to an existing device when the current device is unplugged.
      } else if (changedDevice.device.label === this.channelParameters.localAudioTrack.getTrackLabel()) {
        const oldMicrophones = await AgoraRTC.getMicrophones();

        if (oldMicrophones?.length > 0) {
          this.channelParameters.localAudioTrack.setDevice(oldMicrophones[0].deviceId);
        }
      }
    };

    AgoraRTC.onCameraChanged = async (changedDevice) => {
      // When plugging in a device, switch to a device that is newly plugged in.
      if (changedDevice.state === 'ACTIVE') {
        this.channelParameters.localVideoTrack.setDevice(changedDevice.device.deviceId);
        // Switch to an existing device when the current device is unplugged.
      } else if (changedDevice.device.label === this.channelParameters.localVideoTrack.getTrackLabel()) {
        const oldCameras = await AgoraRTC.getCameras();

        if (oldCameras?.length > 0) {
          this.channelParameters.localVideoTrack.setDevice(oldCameras[0].deviceId);
        }
      }
    };

// Listen for the "user-published" event to retrieve a AgoraRTCRemoteUser object.
    this.agoraEngine.on('user-published', async (user, mediaType) => {
// Subscribe to the remote user when the SDK triggers the "user-published" event.
      await this.agoraEngine.subscribe(user, mediaType);
      console.log('subscribe success');
      // Subscribe and play the remote video in the container If the remote user publishes a video track.
      if (mediaType === 'video') {
        // Retrieve the remote video track.
        this.channelParameters.remoteVideoTrack = user.videoTrack;
        // Retrieve the remote audio track.
        this.channelParameters.remoteAudioTrack = user.audioTrack;
        // Save the remote user id for reuse.
        this.channelParameters.remoteUid = user.uid.toString();
        // Specify the ID of the DIV container. You can use the uid of the remote user.
        this.channelParameters.remoteUid = user.uid.toString();
        // Play the remote video track.
        this.channelParameters.remoteVideoTrack.play(this.remotePlayerContainer.nativeElement);
      }
// Subscribe and play the remote audio track If the remote user publishes the audio track only.
      if (mediaType === 'audio') {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        this.channelParameters.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        this.channelParameters.remoteAudioTrack.play();
      }

      this.remoteUserOnCall = true;
    });

    this.agoraEngine.on('user-left', u => {
      this.remoteUserOnCall = false;

      if (this.callerId !== this.profileService.profile.id) {
        this.leaveCall().then(() => this.navigateToChat());
      }
    });

    this.agoraEngine.on('user-unpublished', u => {
      this.remoteUserOnCall = false;

      if (this.callerId !== this.profileService.profile.id) {
        this.leaveCall().then(() => this.navigateToChat());
      }
    });

    this.agoraEngine.on('token-privilege-will-expire', async () => {});
  }

  onMicMuteBtnClicked(): void {
    if (!this.isMutedMic) {
      this.channelParameters.localAudioTrack.setVolume(0);
      this.isMutedMic = true;
    } else {
      this.channelParameters.localAudioTrack.setVolume(100);
      this.isMutedMic = false;
    }
  }

  toggleChat(): void {
    this.isChatOpened = !this.isChatOpened;
  }

  onMuteVideoBtnClicked(): void {
    if (!this.isMuteVideo) {
      this.channelParameters.localVideoTrack.setEnabled(false);
      this.isMuteVideo = true;
    } else {
      this.channelParameters.localVideoTrack.setEnabled(true);
      this.isMuteVideo = false;
    }
  }

  async shareScreen(): Promise<any> {
    if (!this.isSharingEnabled) {
      // Create a screen track for screen sharing.
      this.channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack({optimizationMode: 'detail'});
      // Stop playing the local video track.
      this.channelParameters.localVideoTrack.stop();
      // Unpublish the local video track.
      await this.agoraEngine.unpublish(this.channelParameters.localVideoTrack);
      // Publish the screen track.
      await this.agoraEngine.publish(this.channelParameters.screenTrack);
      // Play the screen track on local container.
      this.channelParameters.screenTrack.play(this.localPlayerContainer.nativeElement);
      // Update the screen sharing state.
      this.isSharingEnabled = true;
      navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
        // todo handle stop sharing button
        console.log(stream.getVideoTracks());

        stream.getVideoTracks()[0].onended = () => {
          console.log('screen sharing stopped');
        };
      });
    } else {
      // Stop playing the screen track.
      this.channelParameters.screenTrack.stop();
      // Unpublish the screen track.
      await this.agoraEngine.unpublish(this.channelParameters.screenTrack);
      // Publish the local video track.
      await this.agoraEngine.publish(this.channelParameters.localVideoTrack);
      // Play the local video on the local container.
      this.channelParameters.localVideoTrack.play(this.localPlayerContainer.nativeElement);
      // Update the screen sharing state.
      this.isSharingEnabled = false;
    }
  }

  async joinCall(): Promise<any> {
    // Join a channel.
    await this.agoraEngine.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);
    // Create a local audio track from the audio sampled by a microphone.
    this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Publish the local audio and video tracks in the channel.
    await this.agoraEngine.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
    // Play the local video track.
    this.channelParameters.localVideoTrack.play(this.localPlayerContainer.nativeElement);
  }

  async leaveCall(): Promise<any> {
    this.channelParameters.localAudioTrack.close();
    this.channelParameters.localVideoTrack.close();
    await this.agoraEngine.leave();

    if (this.callerId === this.profileService.profile.id) {
      this.callsService.deleteCallRoom(this.route.snapshot.params.userId).subscribe(() => {
        this.navigateToChat();
      });
    } else {
      this.navigateToChat();
    }
  }

  openSettings(): void {
    this.modalRef = this.modalService.open(VideoCallSettingsComponent, {
      centered: true,
      size: 'lg',
    });

    this.modalRef.componentInstance.channelParameters = this.channelParameters;
  }

// Remove the video stream from the container.
  removeVideoDiv(elementId): void {
    console.log('Removing ' + elementId + 'Div');
    const Div = document.getElementById(elementId);
    if (Div) {
      Div.remove();
    }
  }

  public navigateToChat(): void {
    this.router.navigate(['dashboard/chat']);
  }
}
