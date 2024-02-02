import { Component, forwardRef, ViewChild, ElementRef } from '@angular/core';
import {
  setMinutes,
  setHours,
  setSeconds,
  format,
  isMatch,
  parse,
} from 'date-fns';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker-custom',
  templateUrl: './date-picker-custom.component.html',
  styleUrls: ['./date-picker-custom.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerCustomComponent),
      multi: true,
    },
  ],
})
export class DatePickerCustomComponent implements ControlValueAccessor {
  private dateDateFormat: Date | null = null;
  private dateStringFormat: string | null = '';
  public openDatePicker: boolean;
  private disabledFields: boolean;
  @ViewChild('inputDate', { static: true })
  inputDate: ElementRef<HTMLInputElement>;

  propagateChange = (date: Date): void => {
    console.log(date);
  };

  get isDisabled(): boolean {
    return this.disabledFields;
  }

  get dateString(): string {
    return this.dateStringFormat;
  }

  set dateString(date: string) {
    if (
      isMatch(date, 'dd/MM/yyyy') &&
      !this.disabledDate(parse(date, 'dd/MM/yyyy', new Date())) &&
      date.length === 10
    ) {
      let dateNow = parse(date, 'dd/MM/yyyy', new Date());
      dateNow = setHours(dateNow, 0);
      dateNow = setMinutes(dateNow, 0);
      dateNow = setSeconds(dateNow, 0);
      this.dateDateFormat = dateNow;
    } else {
      this.dateDateFormat = null;
    }
    this.dateStringFormat = date;
    this.propagateChange(this.dateDateFormat);
  }

  get dateDate(): Date {
    return this.dateDateFormat;
  }

  set dateDate(date: Date) {
    if (date) {
      this.dateDateFormat = date;
      this.dateStringFormat = format(date, 'dd/MM/yyyy');
    }
    this.propagateChange(this.dateDateFormat);
  }

  toggleDatePickerOpen(): void {
    this.openDatePicker = true;
  }

  toggleDatePickerClose(): void {
    this.openDatePicker = false;
  }

  toggleDatePickerCloseOnBlur(evento: FocusEvent): void {
    if (
      evento.relatedTarget !== document.querySelector('.ant-picker-panel') &&
      evento.relatedTarget !==
        document.querySelector('.ant-picker-header-next-btn') &&
      evento.relatedTarget !==
        document.querySelector('.ant-picker-header-prev-btn') &&
      evento.relatedTarget !==
        document.querySelector('.ant-picker-header-super-next-btn') &&
      evento.relatedTarget !==
        document.querySelector('.ant-picker-header-super-prev-btn')
    ) {
      this.toggleDatePickerClose();
    } else {
      this.inputDate.nativeElement.focus();
    }
  }

  disabledDate = (current: Date): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return current > currentDate;
  };

  writeValue(date: Date): void {
    this.dateDate = date;
  }

  clearValue(): void {
    this.dateDate = null;
    this.dateString = '';
  }

  registerOnChange(fn: (_: Date) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    console.log(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFields = isDisabled;
  }
}
