import {Injectable} from '@angular/core';
import {HttpAgoraTokenWrapperService} from './http-agora-token-wrapper.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AgoraTokenService {
  constructor(private http: HttpAgoraTokenWrapperService) {
  }

  public fetchToken(channel: string, uid: number): Observable<any> {
    return this.http.get(`/rtc/${channel}/1/uid/${uid}?expiry=300`);
  }
}
