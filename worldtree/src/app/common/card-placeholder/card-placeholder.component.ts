import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-card-placeholder',
  templateUrl: './card-placeholder.component.html',
  styleUrls: ['./card-placeholder.component.scss'],
})
export class CardPlaceholderComponent {
  @Input() @HostBinding('class.fill') fill = false;
}
