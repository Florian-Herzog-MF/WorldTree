import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, lastValueFrom, map, switchMap } from 'rxjs';
import {
  WorldObject,
  WorldObjectService,
} from 'src/app/main/world-object.service';
import { SourceService } from '../source.service';
import { MatDialog } from '@angular/material/dialog';
import { ValidateSourceDialogComponent } from '../validate-source-dialog/validate-source-dialog.component';

@Component({
  selector: 'app-write-source',
  templateUrl: './write-source.component.html',
  styleUrls: ['./write-source.component.scss'],
})
export class WriteSourceComponent {
  text = new FormControl('');

  constructor(
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService,
    private readonly matDialog: MatDialog
  ) {}

  async evaluate() {
    if (!this.text.value) {
      alert('no prompt');
      return;
    }
    const sourceText = this.text.value;
    const amount = 10;
    const existingItems = await this.worldObjectService.search(
      sourceText,
      amount
    );
    const newItems = await this.worldObjectService.generate(
      sourceText,
      existingItems
    );

    this.matDialog.open(ValidateSourceDialogComponent, {
      data: { sourceText, existingItems, newItems },
    });
  }
}
