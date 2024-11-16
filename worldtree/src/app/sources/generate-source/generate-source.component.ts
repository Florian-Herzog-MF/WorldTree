import { Component } from '@angular/core';
import { SourceService } from '../source.service';
import { WorldObjectService } from 'src/app/main/world-object.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidateSourceDialogComponent } from '../validate-source-dialog/validate-source-dialog.component';

@Component({
  selector: 'app-generate-source',
  templateUrl: './generate-source.component.html',
  styleUrls: ['./generate-source.component.scss'],
})
export class GenerateSourceComponent {
  prompt = new FormControl('');

  constructor(
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService,
    private readonly matDialog: MatDialog
  ) {}

  async generate() {
    if (!this.prompt.value) {
      alert('no prompt');
      return;
    }
    const amount = 10;
    const source = await this.sourceService.generate(this.prompt.value, amount);
    const existingItems = await this.worldObjectService.search(source, amount);
    const newItems = await this.worldObjectService.generate(
      source,
      existingItems
    );

    this.matDialog.open(ValidateSourceDialogComponent, {
      data: { source, existingItems, newItems },
    });
  }
}
