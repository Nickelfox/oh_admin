import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FeaturedService} from "./services/featured.service";
import {FeaturedStore} from "./store/featured.store";

@NgModule({
  imports: [CommonModule],
  providers:[
    FeaturedService,
    FeaturedStore
  ]
})
export class FeaturedDataAccessModule {}
