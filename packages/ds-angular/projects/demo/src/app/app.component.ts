import { Component, OnInit } from '@angular/core';

const THEME_DEFAULT = [{
  variable: '--ds-color--ui-primary',
  value: '#262626'
}, {
  variable: '--ds-color--text-inverse',
  value: '#FFFFFF'
}, {
  variable: '--ds-color--text-primary',
  value: '#262626'
}, {
  variable: '--ds-color--ui-background-1',
  value: '#dee2e6'
}, {
  variable: '--ds-color--ui-background-2',
  value: '#ced4da'
}, {
  variable: '--ds-color-brand-secondary-main',
  value: '#262626'
}, {
  variable: '--ds-border-radius-m',
  value: '8px'
}];

const THEME_1 = [{
  variable: '--ds-color--ui-primary',
  value: '#e63946'
}, {
  variable: '--ds-color--text-inverse',
  value: '#f1faee'
}, {
  variable: '--ds-color--text-primary',
  value: '#457b9d'
}, {
  variable: '--ds-color--ui-background-1',
  value: '#f1faee'
}, {
  variable: '--ds-color--ui-background-2',
  value: '#a8dadc'
}, {
  variable: '--ds-color-brand-secondary-main',
  value: '#0466c8'
}, {
  variable: '--ds-border-radius-m',
  value: '25px'
}];


const THEME_2 = [{
  variable: '--ds-color--ui-primary',
  value: '#a9005b'
}, {
  variable: '--ds-color-brand-primary-main',
  value: '#a9005b'
}, {
  variable: '--ds-color--text-inverse',
  value: '#ffaffb'
}, {
  variable: '--ds-color--text-primary',
  value: '#a9005b'
}, {
  variable: '--ds-color--ui-background-1',
  value: '#acf8cb'
}, {
  variable: '--ds-color--ui-background-2',
  value: '#ffaffb'
}, {
  variable: '--ds-color-brand-secondary-main',
  value: '#acf8cb'
}, {
  variable: '--ds-border-radius-m',
  value: '0px'
}];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  applyTheme(index: number): void {
    let tokens = THEME_DEFAULT;
    if (index === 1) {
      tokens = THEME_1;
    } else if (index === 2) {
      tokens = THEME_2;
    }
    tokens.forEach((token) => {
      document.documentElement.style
        .setProperty(token.variable, token.value);
    })
  }
}
