import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackService } from './services/pack.service';
import { PackStore } from './store/pack.store';

@NgModule({
  imports: [CommonModule],
  providers:[
    PackService,
    PackStore
  ]
})
export class PackDataAccessModule {}
