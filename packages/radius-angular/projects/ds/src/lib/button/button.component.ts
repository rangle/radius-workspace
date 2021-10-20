import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

const selector = 'ds-button';

const BUTTON_VARIANTS = ['primary', 'secondary', 'chevron', 'icon'] as const;
export type ButtonVariant = typeof BUTTON_VARIANTS[number];

const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = typeof BUTTON_SIZES[number];

@Component({
  selector: `button[${selector}]`,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  private _variant: ButtonVariant = 'primary';
  private _size: ButtonSize = 'medium';

  @Input(selector)
  @HostBinding('class')
  public set classNames(value: string) {
    if (this._classNames === value) {
      return;
    }

    this._classNames = value;

    this._variant = BUTTON_VARIANTS.find(variant => this._classNames.includes(variant)) || 'primary';
    this._size = BUTTON_SIZES.find(size => this._classNames.includes(size)) || 'medium';

  }

  public get classNames(): string {
    return `${selector} ${selector}--${this._variant} ${selector}--${this._size}`;
  }
  private _classNames!: string;
}