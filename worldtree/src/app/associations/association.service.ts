import { Injectable } from '@angular/core';
import { Source } from '../sources/source.service';
import { WorldObject } from '../main/world-object.service';

export interface Association {
  worldObject: WorldObject;
  source: Source;
}

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  constructor() {}
}
