import {Injectable} from "@angular/core";
import {PeriodEnum} from "../enums/period.enum";

@Injectable({providedIn: 'root'})
export class PeriodsService {
  public listPeriods(): string[] {
    return [PeriodEnum.ONE_WEEK, PeriodEnum.TWO_WEEKS, PeriodEnum.ONE_MONTH, PeriodEnum.SIX_MONTHS, PeriodEnum.ONE_YEAR];
  }

  public convertForRequest(period: string): string {
    const split = period.split(' ');
    return split[0] + split[1];
  }
}
