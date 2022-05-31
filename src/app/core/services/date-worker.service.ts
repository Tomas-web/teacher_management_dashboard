import {Injectable} from "@angular/core";

@Injectable()
export class DateWorkerService {

  constructor() {
  }

  public formatDateTime(dateStr: any): string {
    let date;
    if (dateStr instanceof Date) {
      date = dateStr;
    } else {
      date = this.getDateObj(dateStr);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}`;
  }

  public formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}`;
  }

  public getDateObj(dateSrt: string): Date {
    return new Date(dateSrt);
  }

  public convertUTCTime(timeStr: string): string {
    const date = new Date('2021-07-24T' + timeStr);

    return (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()));
  }
}
