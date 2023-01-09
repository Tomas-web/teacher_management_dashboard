import {HttpClientWrapperService} from './http-client-wrapper.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CreateCallRoomResponseModel} from '../models/calls/create-call-room.model';

@Injectable({providedIn: 'root'})
export class CallsService {
  constructor(private http: HttpClientWrapperService) {
  }

  public validateCallRoom(callerId: string, targetId: string, token: string, channelName: string): Observable<any> {
    return this.http.post(`/users/${targetId}/call-room/validate`, {channelName, callerId, token});
  }

  public createCallRoom(targetId: string): Observable<CreateCallRoomResponseModel> {
    return this.http.post(`/users/${targetId}/call-room`, {});
  }

  public deleteCallRoom(targetId: string): Observable<any> {
    return this.http.delete(`/users/${targetId}/call-room`, {});
  }
}
