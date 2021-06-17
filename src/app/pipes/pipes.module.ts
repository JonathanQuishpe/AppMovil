import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterConfigPollPipe } from './filter-config-poll.pipe';



@NgModule({
  declarations: [FilterConfigPollPipe],
  exports: [FilterConfigPollPipe],
/*   imports: [
    CommonModule
  ] */
})
export class PipesModule { }
