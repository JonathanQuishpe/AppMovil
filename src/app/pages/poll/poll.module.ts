import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollPageRoutingModule } from './poll-routing.module';

import { PollPage } from './poll.page';
import { DynamicFormComponent }         from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PollPageRoutingModule
  ],
  declarations: [PollPage, DynamicFormComponent, DynamicFormQuestionComponent],
  entryComponents: [DynamicFormComponent, DynamicFormQuestionComponent]
})
export class PollPageModule {}
