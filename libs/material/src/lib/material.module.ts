import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { ReactiveTypedFormsModule } from '@rxweb/reactive-form-validators';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
  MatRippleModule,
  NativeDateModule
} from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { LuxonDateAdapter, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/LL/yyyy'
  },
  display: {
    dateInput: 'dd/LL/yyyy',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveTypedFormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatDatepickerModule,
    MatCardModule,
    NativeDateModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSortModule,
    MatListModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    DragDropModule,

    // Non-Material Imports
    ImageCropperModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  exports: [
    FormsModule,
    ReactiveTypedFormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatDatepickerModule,
    MatCardModule,
    NativeDateModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSortModule,
    MatListModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    DragDropModule,

    // Non-Material Exports
    ImageCropperModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  providers: [
    FormGroupDirective,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    // {provide: MAT_DATE_FORMATS, useValue: MY_NATIVE_DATE_FORMATS},
    // {
    //   provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS]
    // },
    // {
    //   provide: NgxMatDateAdapter,
    //   useClass: LuxonDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MaterialModule {
}
