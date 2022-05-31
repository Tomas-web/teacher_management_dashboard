import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {

  @ViewChild('image', { static: false })
  public imageElement: ElementRef;
  @Input() imageSrc: string;
  @Output() setCroppedPhoto = new EventEmitter<string>();

  private cropper: Cropper;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: true,
      aspectRatio: 1,
      dragMode: 'move',
      movable: true,
      zoomOnWheel: true,
      viewMode: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      minCropBoxHeight: 256,
      minCropBoxWidth: 256,
    });
  }

  public setPhoto(): void {
    const newImageSrc = this.cropper
      .getCroppedCanvas({ width: 256, height: 256 })
      .toDataURL();
    this.setCroppedPhoto.emit(newImageSrc);
  }

}
