import {Component, Input, OnInit} from '@angular/core';
import {Homework} from '../../core/models/homeworks-response.model';
import {DateWorkerService} from '../../core/services/date-worker.service';
import {FilesService} from '../../core/http/files.service';

@Component({
  selector: 'app-homeworks-list',
  templateUrl: './homeworks-list.component.html',
  styleUrls: ['./homeworks-list.component.scss']
})
export class HomeworksListComponent implements OnInit {
  @Input() homeworks: Homework[];
  @Input() forTeacher?: boolean;

  public selectedHomework: Homework;

  public selectedFiles: File[];

  public showFileDeletedMessage: boolean;
  public showUploadedSuccessfullyMessage: boolean;

  constructor(public dateWorker: DateWorkerService,
              private filesService: FilesService) { }

  ngOnInit(): void {
  }

  public selectHomework(homework: Homework): void {
    this.selectedHomework = homework;
    this.selectedFiles = [];
  }

  public onFileSelected(event: any): void {
    this.selectedFiles = [];
    const filesList = event.target.files;
    const filesListKeys = Object.keys(filesList);
    filesListKeys.forEach((key) => {
      const file: File = filesList[key];
      if (file) {
        this.selectedFiles.push(file);
      }
    });
  }

  public uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.showUploadedSuccessfullyMessage = false;
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    this.filesService.uploadFiles(this.selectedHomework.id, formData).subscribe((files) => {
      this.selectedFiles = [];

      if (this.showFileDeletedMessage) {
        this.showFileDeletedMessage = false;
      }
      this.showUploadedSuccessfullyMessage = true;

      files.forEach(file => {
        this.selectedHomework.uploads.push({
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.size,
          downloadUri: file.fileDownloadUri,
          uploadedAt: new Date().toISOString(),
        });
      });
    });
  }

  public downloadFile(fileName: string, homeworkId: string): void {
    this.filesService.downloadFIle(homeworkId, fileName).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  public deleteFile(fileName: string, homeworkId: string): void {
    this.showFileDeletedMessage = false;
    this.filesService.deleteFile(homeworkId, fileName).subscribe(() => {
      if (this.showUploadedSuccessfullyMessage) {
        this.showUploadedSuccessfullyMessage = false;
      }
      this.showFileDeletedMessage = true;

      this.selectedHomework.uploads = this.selectedHomework.uploads.filter(upload => upload.fileName !== fileName);
    });
  }
}
