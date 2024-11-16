import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorldObject } from 'src/app/main/world-object.service';
import { Source, SourceService } from '../source.service';

@Component({
  selector: 'app-validate-source-dialog',
  templateUrl: './validate-source-dialog.component.html',
  styleUrls: ['./validate-source-dialog.component.scss'],
})
export class ValidateSourceDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      source: Source;
      items: (WorldObject & { new: boolean })[];
    },
    public readonly dialogRef: MatDialogRef<ValidateSourceDialogComponent>,
    private readonly sourceService: SourceService
  ) {}

  attributeItems(item: WorldObject): { key: string; value: string }[] {
    return Object.entries(item.attributes).map(([key, value]) => ({
      key,
      value,
    }));
  }

  discard() {
    this.dialogRef.close();
  }

  async accept() {}
}
