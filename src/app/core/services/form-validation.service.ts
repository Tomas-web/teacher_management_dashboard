import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class FormValidationService {
  private static readonly EMAIL_REGEXP = /@/i;
  private static readonly POSITIVE_NUMBER_REGEXP = /^[1-9][0-9]*$/i;
  private static readonly STARTS_WITH_LETTER_REGEXP = /^[a-zA-Z\p{L}]/iu;
  private static readonly USER_NAME_REGEXP =
    /^[A-Za-z\p{L}]?[-,A-Za-z\p{L} '.]+$/iu;
  private static readonly TIME_REGEXP = /^([0-1][0-9]|2[0-3]):[0-5][0-9]/i;

  public static validateUserName(control: AbstractControl): ValidationErrors | null {
    const startsWithLetter =
      FormValidationService.STARTS_WITH_LETTER_REGEXP.test(
        control.value
      );

    if (!startsWithLetter) {
      return { firstNotLetter: { value: control.value } };
    }

    const forbidden = !FormValidationService.USER_NAME_REGEXP.test(
      control.value
    );
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  }

  public static validateEmail(control: AbstractControl): ValidationErrors | null {
    const forbidden = !FormValidationService.EMAIL_REGEXP.test(
      control.value
    );
    return forbidden ? { invalidEmail: { value: control.value } } : null;
  }

  public static validateNumber(control: AbstractControl): ValidationErrors | null {
    const forbidden = !FormValidationService.POSITIVE_NUMBER_REGEXP.test(
      control.value
    );
    return forbidden ? { notPositiveNumber: { value: control.value } } : null;
  }

  public static validateTime(control: AbstractControl): ValidationErrors | null {
    const forbidden = !FormValidationService.TIME_REGEXP.test(
      control.value
    );
    return forbidden ? { incorrectFormat: { value: control.value } } : null;
  }
}
