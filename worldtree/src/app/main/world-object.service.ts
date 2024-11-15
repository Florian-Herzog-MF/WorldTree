import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

export enum WorldObjectType {
  Character = 'Character',
  Town = 'Town',
  Building = 'Building',
  Item = 'Item',
}

export interface WorldObjectTypeEnhanced {
  value: WorldObjectType;
  label: string;
  description: string;
}

export const WorldObjectTypesEnhanced: WorldObjectTypeEnhanced[] = [
  {
    value: WorldObjectType.Character,
    label: 'Character',
    description: 'A person or creature in your world.',
  },
  {
    value: WorldObjectType.Town,
    label: 'Town',
    description: 'A settlement in your world.',
  },
  {
    value: WorldObjectType.Building,
    label: 'Building',
    description: 'A structure in your world.',
  },
  {
    value: WorldObjectType.Item,
    label: 'Item',
    description: 'An object in your world.',
  },
];

export interface WorldObject {
  id: string;
  name: string;
  sourceIds: string[];
  type: WorldObjectType;
}

@Injectable({
  providedIn: 'root',
})
export class WorldObjectService {
  constructor(private readonly http: HttpClient) {}

  getPaged(type: WorldObjectType, skip: number, amount: number) {
    return this.http.get<WorldObject>(`api/v1/world-object`, {
      params: {
        type,
        skip,
        amount,
      },
    });
  }

  search(prompt: string) {
    return this.http.get<WorldObject[]>(
      `api/v1/world-object/search?prompt=${prompt}&amount=10`
    );
  }
}
