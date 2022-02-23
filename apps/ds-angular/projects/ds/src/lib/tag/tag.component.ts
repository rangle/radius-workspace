import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

const selector = 'ds-tag';
@Component({
  selector: 'ds-tag',
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {

  @Input()
  type: 'primary' | 'secondary' | 'error' | 'success' | 'alert' = 'primary';

  @Input()
  variant: 'solid' | 'outline' = 'solid';

  private _classNames!: string;

  @Input(selector)
  @HostBinding('class')
  public set classNames(value: string) {
    if (this._classNames === value) {
      return;
    }

    this._classNames = value;
  }

  public get classNames(): string {
    return `${selector} ${selector}--${this.type}--${this.variant}`;
  }
}
