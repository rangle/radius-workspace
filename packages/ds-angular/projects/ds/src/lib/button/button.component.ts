import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

const selector = 'ds-button';

const BUTTON_VARIANTS = ['primary', 'secondary', 'chevron', 'icon'] as const;
const BUTTON_SIZES = ['small', 'medium', 'large'] as const;

@Component({
  selector: `button,a[${selector}]`,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

  /**
  Sets the variant of the button.
  */
  @Input()
  variant: 'primary' | 'secondary' | 'chevron' | 'icon' = 'primary';

  /**
  Sets the size of the button.
  */
  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  private _classNames!: string;

  @Input(selector)
  @HostBinding('class')
  public set classNames(value: string) {
    if (this._classNames === value) {
      return;
    }

    this._classNames = value;

    this.variant = BUTTON_VARIANTS.find(variant => this._classNames.includes(variant)) || 'primary';
    this.size = BUTTON_SIZES.find(size => this._classNames.includes(size)) || 'medium';
  }

  public get classNames(): string {
    return `${selector} ${selector}--${this.variant} ${selector}--${this.size}`;
  }

}