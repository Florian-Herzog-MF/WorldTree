import { Directive, HostBinding, Input } from '@angular/core';
const definitions = {
  Construction: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 10 10">
    <g fill-opacity="0.1">
      <polygon fill="#FFFFFF" points="0 0 5 0 0 5"/>
      <polygon fill="#FFFFFF" points="10 0 10 5 5 10 0 10"/>
    </g>
  </svg>`,
} as const;

export type BackdropKey = keyof typeof definitions;

const encoded = Object.fromEntries(
  Object.entries(definitions).map(([key, value]) => [
    key,
    encodeURIComponent(value),
  ])
);

@Directive({
  selector: '[appBackdrop]',
})
export class BackdropDirective {
  @Input() appBackdrop!: BackdropKey;

  @HostBinding('style.background-image') get backdropSvg() {
    return `url("data:image/svg+xml,${encoded[this.appBackdrop]}")`;
  }
}
