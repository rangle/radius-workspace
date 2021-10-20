import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

const selector = 'ds-text';

const TEXT_VARIANTS = ['l', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type TextVariant = typeof TEXT_VARIANTS[number];

@Component({
  selector: `p[${selector}]`,
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {
  public variant: TextVariant = 'l';

  @Input(selector)
  @HostBinding('class')
  public set classNames(value: string) {
    if (this._classNames === value) {
      return;
    }

    this._classNames = value;

    this.variant = TEXT_VARIANTS.find(variant => {
      console.log('variant11', variant);
      return this._classNames === variant;
    }) || 'l';
    console.log('this._classNames', value, this._classNames, this.variant);
  }
  public get classNames(): string {
    console.log(`${selector} ${selector}--${this.variant}`);
    return `${selector} ${selector}--${this.variant}`;
  }
  private _classNames!: string;
}