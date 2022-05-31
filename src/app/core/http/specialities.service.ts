import {Injectable} from "@angular/core";
import {HttpClientWrapperService} from "./http-client-wrapper.service";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class SpecialitiesService {
    constructor(private http: HttpClientWrapperService) {
    }

    public getSpecialities(): Observable<string[]> {
      return this.http.get(`/specialities`);
    }
}
