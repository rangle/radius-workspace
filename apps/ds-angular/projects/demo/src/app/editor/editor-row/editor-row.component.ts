import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editor-row',
  templateUrl: './editor-row.component.html',
  styleUrls: ['./editor-row.component.css']
})
export class EditorRowComponent {
  @Input() variable!: string;
  @Input() value!: string;
  @Input() type: 'color' | 'text' = 'text';

  onChangeEvent(event: any) {
    document.documentElement.style
      .setProperty(this.variable, event.target.value);
  }
}
