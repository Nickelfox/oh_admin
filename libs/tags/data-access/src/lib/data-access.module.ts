import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsService } from './services/tags.service';
import { TagsStore } from './store/tags.store';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TagsService,
    TagsStore
  ]
})
export class TagsDataAccessModule {
}
