import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {ReactiveTypedFormsModule} from '@rxweb/reactive-form-validators';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_FORMATS, MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { ChartsModule } from '@rinminase/ng-charts';

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
    MatDatepickerModule,
    MatCardModule,
    NativeDateModule,
    MatNativeDateModule,
    ChartsModule
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
    MatDatepickerModule,
    MatCardModule,
    NativeDateModule,
    MatNativeDateModule,
    ChartsModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    // {provide: MAT_DATE_FORMATS, useValue: MY_NATIVE_DATE_FORMATS},

  ]
})
export class MaterialModule {
}
