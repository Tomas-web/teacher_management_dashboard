import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-action-confirmation',
  templateUrl: './action-confirmation.component.html',
  styleUrls: ['./action-confirmation.component.scss']
})
export class ActionConfirmationComponent implements OnInit {
  @Input() description: string;

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public confirm(): void {
    this.onSubmit.emit();
  }

  public dismiss(): void {
    this.activeModal.close();
  }
}
