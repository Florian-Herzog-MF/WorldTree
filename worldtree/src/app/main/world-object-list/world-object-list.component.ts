import { Component, Input } from '@angular/core';
import { WorldObject } from '../world-object.service';
import { MatDialog } from '@angular/material/dialog';
import { WorldObjectDetailsDialogComponent } from '../world-object-details-dialog/world-object-details-dialog.component';

@Component({
  selector: 'app-world-object-list',
  templateUrl: './world-object-list.component.html',
  styleUrls: ['./world-object-list.component.scss'],
})
export class WorldObjectListComponent {
  private _items: WorldObject[] = [];
  public get items(): WorldObject[] {
    return this._items;
  }
  @Input()
  public set items(value: WorldObject[] | null) {
    this._items = value ?? [];
  }

  constructor(private readonly matDialog: MatDialog) {}

  attributesTooltip(item: WorldObject) {
    return Object.keys(item.attributes)
      .map((key) => `${key}: ${item.attributes[key]}`)
      .join('\n');
  }

  showDetails(item: WorldObject) {
    this.matDialog.open(WorldObjectDetailsDialogComponent, { data: item });
  }
}
