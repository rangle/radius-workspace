import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonComponent } from './button/button.component';
import { TextComponent } from './text/text.component';
import { TagComponent } from './tag/tag.component';

@NgModule({
  declarations: [
    ButtonComponent,
    TextComponent,
    TagComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    TagComponent,
    TextComponent
  ]
})
export class DsModule { }
