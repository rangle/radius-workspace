import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorRowComponent } from './editor-row/editor-row.component';
import { EditorComponent } from './editor/editor.component';
import { DsModule } from '../../../../ds/src/public-api';

@NgModule({
  declarations: [
    EditorRowComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    DsModule
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
