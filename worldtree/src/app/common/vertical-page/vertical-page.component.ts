import { Component, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { WoService } from 'src/app/main/wo.service';

@Component({
  selector: 'app-vertical-page',
  templateUrl: './vertical-page.component.html',
  styleUrls: ['./vertical-page.component.scss'],
})
export class VerticalPageComponent {
  @Input() header = 'WorldTree';

  constructor(private readonly woService: WoService) {}

  async debug() {
    console.log('debug');
    var result = await lastValueFrom(this.woService.debug());
    console.log(result);
  }
}
