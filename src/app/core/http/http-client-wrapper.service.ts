import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class HttpClientWrapperService {
  private apiURL = environment.base_api_url + '/api';
  private httpOptions = {};

  constructor(private httpClient: HttpClient) {
  }

  get<T>(url: string, params?: any): Observable<T> {
    return this.httpClient
      .get<T>(this.apiURL + url, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError<T>('get:' + url, null)));
  }

  delete<T>(url: string, params?: any): Observable<T> {
    return this.httpClient
      .delete<T>(this.apiURL + url, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError<T>('delete:' + url, null)));
  }

  post<T>(url: string, body, params?: any): Observable<T> {
    return this.httpClient
      .post<T>(this.apiURL + url, body, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError<T>('post:' + url, null)));
  }

  put<T>(url: string, body, params?: any): Observable<T> {
    return this.httpClient
      .put<T>(this.apiURL + url, body, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError<T>('put:' + url, null)));
  }

  private handleError<T>(operation, result?: T): any {
    return (error: any): Observable<T> => {
      return throwError(error);
    };
  }
}
