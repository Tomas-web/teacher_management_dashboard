import {Injectable} from '@angular/core';
import {HttpClientWrapperService} from './http-client-wrapper.service';
import {Observable} from 'rxjs';

interface UploadedFile {
  fileName: string;
  fileDownloadUri: string;
  fileType: string;
  size: number;
}

@Injectable({providedIn: 'root'})
export class FilesService {

  constructor(private http: HttpClientWrapperService) {
  }

  public uploadFiles(homeworkId: string, formData: FormData): Observable<UploadedFile[]> {
    return this.http.post(`/files/homeworks/${homeworkId}/upload-multiple`, formData, {
      headers: { 'Content-Type': undefined },
    });
  }

  public downloadFIle(homeworkId: string, fileName: string): Observable<any> {
    return this.http.get(`/files/homeworks/${homeworkId}/download/${fileName}`);
  }

  public deleteFile(homeworkId: string, fileName: string): Observable<any> {
    return this.http.delete(`/files/delete?homework_id=${homeworkId}&file_name=${fileName}`);
  }
}
