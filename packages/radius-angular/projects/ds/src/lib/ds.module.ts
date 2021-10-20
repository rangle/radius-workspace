import { NgModule } from '@angular/core';

import { ButtonComponent } from './button/button.component';
import { HelloComponent } from './hello/hello.component';

@NgModule({
  declarations: [
    ButtonComponent,
    HelloComponent
  ],
  imports: [
  ],
  exports: [
    ButtonComponent,
    HelloComponent
  ]
})
export class DsModule { }
