import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../core/services/form-validation.service';
import {ProfileService} from '../../core/http/profile.service';
import {ProfileModel} from '../../core/models/profile.model';
import {UserRoleEnum} from '../../core/enums/user-role.enum';
import {SpecialitiesService} from '../../core/http/specialities.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UploadAvatarComponent} from '../../common/modals/upload-avatar/upload-avatar.component';
import {LessonReservationModel} from '../../core/models/student-lesson-reservation.model';
import {UsersService} from '../../core/http/users.service';
import {PostModel} from '../../core/models/posts.model';
import {ChartComponent} from 'ng-apexcharts';
import {PostView} from '../../core/models/post-views.model';
import {PeriodsService} from '../../core/services/periods.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: any;
  public postViews: PostView[];

  public generalUserForm: FormGroup;
  public teacherSettingsForm: FormGroup;
  public userRoleEnum = UserRoleEnum;
  public profile: ProfileModel;
  public specialities: string[];
  public filteredSpecialities: string[];

  public workingTimesErr = false;
  public submitting: boolean;
  public success: boolean;
  public savingError: boolean;
  public showSpecialities: boolean;
  public specialityIdx = 0;
  public modalRef: NgbModalRef;
  public userPost: PostModel;

  public periods: string[];
  public selectedPeriod: string;

  private postViewsSub: Subscription;
  constructor(private usersService: UsersService,
              private profileService: ProfileService,
              private specialitiesService: SpecialitiesService,
              private modalService: NgbModal,
              private periodsService: PeriodsService) {
    this.periods = periodsService.listPeriods();
    this.selectedPeriod = this.periods[0];
    this.initChartOptions();
  }

  ngOnDestroy(): void {
    this.unsubPostViews();
  }

  ngOnInit(): void {
    this.getSpecialities();
    if (!this.profileService.profile) {
      this.profileService.getProfileData().subscribe((profile) => {
        this.profileService.profile = profile;
        this.profile = Object.assign({}, profile);
        this.initData();
      });
    } else {
      this.profile = Object.assign({}, this.profileService.profile);
      this.initData();
    }
  }

  public initData(): void {
    this.profile.workingTimeStart = this.profile.workingTimeStart ? this.profile.workingTimeStart.replace('Z', '') : null;
    this.profile.workingTimeEnd = this.profile.workingTimeEnd ? this.profile.workingTimeEnd.replace('Z', '') : null;
    if (this.profile.roleId === UserRoleEnum.TEACHER) {
      this.getPostViews();
    }
    this.createGeneralUserForm();
    this.createTeacherForm();
  }

  public selectPeriod(value: string): void {
    this.selectedPeriod = value;
    this.getPostViews();
  }

  public showSpecialitiesList(e: any): void {
    e.stopPropagation();
    this.showSpecialities = true;
  }

  public hideSpecialitiesList(): void {
    this.showSpecialities = false;
  }

  public specialitiesSearch(): void {
    this.filteredSpecialities = this.specialities.filter(
      (speciality) => speciality.toLowerCase().includes(this.speciality.value.toLowerCase())
    );
  }

  public selectSpeciality(value: string): void {
    this.teacherSettingsForm.controls.speciality.setValue(value);
    this.hideSpecialitiesList();
  }

  public moveInSpecialitiesList(event: any): void {
    const scroll = document.getElementById('specialities-list');
    if (
      event.code === 'ArrowDown' &&
      this.specialityIdx < this.filteredSpecialities.length - 1
    ) {
      scroll.scrollTop = scroll.scrollTop + 48;
      this.specialityIdx++;
    } else if (
      event.code === 'ArrowUp' &&
      this.specialityIdx > 0
    ) {
      scroll.scrollTop = scroll.scrollTop - 48;
      this.specialityIdx--;
    } else if (event.code === 'Enter') {
      if (this.filteredSpecialities.length > 0) {
        this.selectSpeciality(
          this.filteredSpecialities[this.specialityIdx]
        );
      }
    }
  }

  public save(): void {
    this.success = false;
    this.savingError = false;
    this.workingTimesErr = false;

    if (!this.generalUserForm.valid || this.submitting) {
      return;
    }

    if (this.profile.roleId === UserRoleEnum.TEACHER) {
      if (!this.teacherSettingsForm.valid) {
        return;
      }

      if (!this.specialities.includes(this.speciality.value)) {
        return;
      }
    }

    const data = {
      fullName: this.fullName.value,
      about: this.about.value,
      roleId: this.profile.roleId,
      email: this.email.value,
      price: null,
      address: null,
      contacts: null,
      speciality: null,
      workingTimeStart: null,
      workingTimeEnd: null,
    };

    if (this.profile.roleId === UserRoleEnum.TEACHER) {
      data.price = this.price.value;
      data.address = this.address.value;
      data.contacts = this.contacts.value;
      data.speciality = this.speciality.value;
      data.workingTimeStart = this.workingTimeStart.value;
      data.workingTimeEnd = this.workingTimeEnd.value;

      if (this.workingTimesInvalid()) {
        this.workingTimesErr = true;
        return;
      }
    }

    this.submitting = true;
    this.profileService.updateProfile(data).subscribe(() => {
        this.profile.fullName = data.fullName;
        this.profile.email = data.email;
        this.profile.description = data.about;
        this.profile.price = data.price;
        this.profile.contacts = data.contacts;
        this.profile.speciality = data.speciality;
        this.profile.workingTimeStart = data.workingTimeStart;
        this.profile.workingTimeEnd = data.workingTimeEnd;
        this.profileService.profile = this.profile;
        this.success = true;
        this.submitting = false;
    }, () => {
        this.savingError = true;
        this.submitting = false;
    });
  }

  get fullName(): AbstractControl {
    return this.generalUserForm.controls.fullName;
  }

  get email(): AbstractControl {
    return this.generalUserForm.controls.email;
  }

  get about(): AbstractControl {
    return this.generalUserForm.controls.about;
  }

  get price(): AbstractControl {
    return this.teacherSettingsForm.controls.price;
  }

  get address(): AbstractControl {
    return this.teacherSettingsForm.controls.address;
  }

  get contacts(): AbstractControl {
    return this.teacherSettingsForm.controls.contacts;
  }

  get speciality(): AbstractControl {
    return this.teacherSettingsForm.controls.speciality;
  }

  get workingTimeStart(): AbstractControl {
    return this.teacherSettingsForm.controls.workingTimeStart;
  }

  get workingTimeEnd(): AbstractControl {
    return this.teacherSettingsForm.controls.workingTimeEnd;
  }

  public onClickRoleToggle(): void {
    this.profile.roleId = this.profile.roleId === UserRoleEnum.STUDENT ? UserRoleEnum.TEACHER : UserRoleEnum.STUDENT;

    if (this.profile.roleId === UserRoleEnum.STUDENT) {
      this.teacherSettingsForm.controls.price.disable();
      this.teacherSettingsForm.controls.address.disable();
      this.teacherSettingsForm.controls.contacts.disable();
      this.teacherSettingsForm.controls.speciality.disable();
      this.teacherSettingsForm.controls.workingTimeStart.disable();
      this.teacherSettingsForm.controls.workingTimeEnd.disable();
    } else {
      this.teacherSettingsForm.controls.price.enable();
      this.teacherSettingsForm.controls.address.enable();
      this.teacherSettingsForm.controls.contacts.enable();
      this.teacherSettingsForm.controls.speciality.enable();
      this.teacherSettingsForm.controls.workingTimeStart.enable();
      this.teacherSettingsForm.controls.workingTimeEnd.enable();
    }
  }

  public openAvatarUpload(): void {
    this.modalRef = this.modalService.open(UploadAvatarComponent, {
      centered: true,
      size: 'lg',
    });

    this.modalRef.componentInstance.avatarUrl = this.profile.picture;
    this.modalRef.componentInstance.avatarUpdated.subscribe((avatar) => {
      this.profile.picture = avatar;
      this.modalRef.dismiss();
    });

  }

  private workingTimesInvalid(): boolean {
    const hour1 = Number(this.workingTimeStart.value.split(':')[0]);
    const hour2 = Number(this.workingTimeEnd.value.split(':')[0]);

    if (hour1 > hour2) {
      return true;
    }

    const minute1 = Number(this.workingTimeStart.value.split(':')[1]);
    const minute2 = Number(this.workingTimeEnd.value.split(':')[1]);

    if (minute1 > minute2) {
      return true;
    }

    return false;
  }

  private createGeneralUserForm(): void {
    this.generalUserForm = new FormGroup({
      fullName: new FormControl(this.profile.fullName, FormValidationService.validateUserName),
      email: new FormControl(this.profile.email, FormValidationService.validateEmail),
      about: new FormControl(this.profile.description),
    });
  }

  private createTeacherForm(): void {
    this.teacherSettingsForm = new FormGroup({
      price: new FormControl(
        {
          value: this.profile.price,
          disabled: this.profile.roleId === UserRoleEnum.STUDENT
        },
        FormValidationService.validateNumber
      ),
      address: new FormControl({value: this.profile.address, disabled: this.profile.roleId === UserRoleEnum.STUDENT}, Validators.required),
      contacts: new FormControl(
        {
          value: this.profile.contacts,
          disabled: this.profile.roleId === UserRoleEnum.STUDENT
        },
        Validators.required
      ),
      speciality: new FormControl(
        {
          value: this.profile.speciality,
          disabled: this.profile.roleId === UserRoleEnum.STUDENT
        },
        Validators.required
      ),
      workingTimeStart: new FormControl(
        {
          value: this.profile.workingTimeStart,
          disabled: this.profile.roleId === UserRoleEnum.STUDENT
        },
        FormValidationService.validateTime
      ),
      workingTimeEnd: new FormControl(
        {
          value: this.profile.workingTimeEnd,
          disabled: this.profile.roleId === UserRoleEnum.STUDENT
        },
        FormValidationService.validateTime
      ),
    });
  }

  private getSpecialities(): void {
    this.specialitiesService.getSpecialities().subscribe((specialities) => {
      this.filteredSpecialities = specialities;
      this.specialities = specialities;
    });
  }

  private initChartOptions(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
      },
      colors: ['#5390D9'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      labels: [],
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: 'left'
      }
    };
  }

  private setChartSeriesAndLabels(views: PostView[]): void {
    this.chartOptions.series.push({name: 'Views', data: views.map(view => view.value)});
    this.chartOptions.labels = views.map(view => view.date);
  }

  private getPostViews(): void {
    this.unsubPostViews();
    this.postViews = null;
    this.chartOptions.series = [];
    this.chartOptions.labels = [];
    this.postViewsSub = this.profileService
      .getPostViews(this.periodsService.convertForRequest(this.selectedPeriod))
      .subscribe((res) => {
        this.setChartSeriesAndLabels(res.postViews);
        this.postViews = res.postViews;
    });
  }

  private unsubPostViews(): void {
    if (this.postViewsSub) {
      this.postViewsSub.unsubscribe();
      this.postViewsSub = null;
    }
  }
}
