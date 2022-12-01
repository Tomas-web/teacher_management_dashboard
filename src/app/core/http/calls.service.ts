import {HttpClientWrapperService} from './http-client-wrapper.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CreateCallRoomResponseModel} from '../models/calls/create-call-room.model';

@Injectable({providedIn: 'root'})
export class CallsService {
  constructor(private http: HttpClientWrapperService) {
  }

  public createCallRoom(targetId: string): Observable<CreateCallRoomResponseModel> {
    return this.http.post(`/user/${targetId}/call-room`, {});
  }

  public deleteCallRoom(targetId: string): Observable<any> {
    return this.http.delete(`/user/${targetId}/call-room`, {});
  }
}
