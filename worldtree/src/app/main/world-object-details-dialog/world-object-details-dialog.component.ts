import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorldObject } from '../world-object.service';
import { Source, SourceService } from 'src/app/sources/source.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-world-object-details-dialog',
  templateUrl: './world-object-details-dialog.component.html',
  styleUrls: ['./world-object-details-dialog.component.scss'],
})
export class WorldObjectDetailsDialogComponent implements OnInit {
  attributeItems: { key: string; value: string }[] = Object.entries(
    this.data.attributes
  ).map(([key, value]) => ({ key, value }));

  sources: Source[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: WorldObject,
    public readonly dialogRef: MatDialogRef<WorldObjectDetailsDialogComponent>,
    private readonly sourceService: SourceService
  ) {}

  ngOnInit() {
    this.data.sourceIds.forEach(async (id) => {
      this.sources.push(await lastValueFrom(this.sourceService.get(id)));
    });
  }
}
