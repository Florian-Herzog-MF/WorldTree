import { Component, Input } from '@angular/core';
import { WorldObject } from '../world-object.service';

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
}
