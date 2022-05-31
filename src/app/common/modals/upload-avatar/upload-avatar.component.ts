import {Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {ProfileService} from '../../../core/http/profile.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {
  @Input() avatarUrl: string;

  @Output() avatarUpdated: EventEmitter<any> = new EventEmitter();

  @ViewChild('imageInput') imageInput: ElementRef;

  public imageFile: Blob;
  public imageToCrop: string;
  public imageTooBigErr = false;
  public imageTypeNotAllowed = false;
  public showCropper = false;
  public submitting = false;
  public requestErr: boolean;

  constructor(private profileService: ProfileService,
              private activeModal: NgbActiveModal) { }

  ngOnInit(): void {

  }

  public setPhoto(newImageSrc: string): void {
    this.avatarUrl = newImageSrc;
    this.imageFile = this.getImageBold(this.avatarUrl);
    this.showCropper = false;
  }

  public upload(): void {
    if (!this.imageFile || this.submitting) {
      return;
    }

    this.requestErr = false;
    this.submitting = true;
    this.profileService.uploadAvatar(this.imageFile).subscribe(() => {
      this.submitting = false;
      this.avatarUpdated.emit(this.avatarUrl);
    }, (err) => {
      this.submitting = false;
      if (err.status === 413) {
        this.imageTooBigErr = true;
      } else {
        this.requestErr = true;
      }
    });
  }

  public processFile(imageInput: any): void {
    if (imageInput && imageInput.files.length) {
      this.imageTypeNotAllowed = false;
      this.imageTooBigErr = false;
      const file: File = imageInput.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
          this.imageToCrop = event.target.result;
          this.showCropper = true;
          this.imageInput.nativeElement.value = null;
        });

        reader.readAsDataURL(file);
      } else {
        this.imageTypeNotAllowed = true;
      }
    }
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  private getImageBold(base64Image: string): Blob {
    const split = base64Image.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');
    const byteString = atob(split[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  }
}
