import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-dropdown-objects',
  templateUrl: './dropdown-objects.component.html',
  styleUrls: ['./dropdown-objects.component.scss']
})
export class DropdownObjectsComponent implements OnInit {
  @Input() currentValue: string;
  @Input() items: any[];

  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public onClickItem(value: any): void {
    this.itemSelected.emit(value);
  }
}
