import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  WorldObject,
  WorldObjectService,
} from 'src/app/main/world-object.service';
import { Source, SourceService } from '../source.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-validate-source-dialog',
  templateUrl: './validate-source-dialog.component.html',
  styleUrls: ['./validate-source-dialog.component.scss'],
})
export class ValidateSourceDialogComponent {
  desc = new FormControl('', [
    Validators.minLength(10),
    Validators.maxLength(50),
    Validators.required,
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      sourceText: string;
      newItems: WorldObject[];
      existingItems: WorldObject[];
    },
    public readonly dialogRef: MatDialogRef<ValidateSourceDialogComponent>,
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService
  ) {
    console.log(data);
  }

  attributeItems(item: WorldObject): { key: string; value: string }[] {
    return Object.entries(item.attributes ?? {}).map(([key, value]) => ({
      key,
      value,
    }));
  }

  discard() {
    this.dialogRef.close();
  }

  async accept() {
    if (!this.desc.value) {
      alert('no summary');
      return;
    }

    const sourceId = await this.sourceService.persist(
      this.data.sourceText,
      this.desc.value
    );
    for (const item of this.data.newItems) {
      await this.worldObjectService.persist(item, sourceId);
    }
    this.dialogRef.close(true);
  }
}
