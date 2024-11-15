import { Component, Input } from '@angular/core';
import { WorldObjectService } from 'src/app/main/world-object.service';

@Component({
  selector: 'app-vertical-page',
  templateUrl: './vertical-page.component.html',
  styleUrls: ['./vertical-page.component.scss'],
})
export class VerticalPageComponent {
  @Input() header = 'WorldTree';

  constructor() {}
}
