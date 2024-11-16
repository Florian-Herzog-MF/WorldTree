import { Component } from '@angular/core';
import { SourceService } from '../source.service';
import { WorldObjectService } from 'src/app/main/world-object.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-generate-source',
  templateUrl: './generate-source.component.html',
  styleUrls: ['./generate-source.component.scss'],
})
export class GenerateSourceComponent {
  prompt = new FormControl('');

  constructor(
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService
  ) {}

  async generate() {
    this.prompt.setValue('sampleText');
  }
}
