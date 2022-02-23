import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

const selector = 'ds-text';

@Component({
  selector: `h1,h2,h3,h4,h5,p,label[${selector}]`,
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {
  @Input() size: '5xl' | '4xl' | '3xl' | '2xl' | 'l' | 'm' | 's' | 'xs' = 'm';

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
    return `${selector} ${selector}--${this.size}`;
  }
}