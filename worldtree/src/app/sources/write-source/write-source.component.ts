import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, lastValueFrom, map, switchMap } from 'rxjs';
import {
  WorldObject,
  WorldObjectService,
} from 'src/app/main/world-object.service';
import { SourceService } from '../source.service';

@Component({
  selector: 'app-write-source',
  templateUrl: './write-source.component.html',
  styleUrls: ['./write-source.component.scss'],
})
export class WriteSourceComponent {
  text = new FormControl('');

  constructor(
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService
  ) {}

  async evaluate() {}
}
