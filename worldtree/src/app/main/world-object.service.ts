import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

export interface WorldObject {
  id: string;
  name: string;
  sourceIds: string[];
  type: WorldObjectType;
}

type Paged<T> = { limit: number; data: T[] };

@Injectable({
  providedIn: 'root',
})
export class WorldObjectService {
  constructor(private readonly http: HttpClient) {}

  getPaged(params: {
    type?: WorldObjectType;
    amount: number;
    skip: number;
    query?: string;
  }) {
    return this.http.get<Paged<WorldObject>>(`api/v1/world-objects`, {
      params,
    });
  }

  search(prompt: string) {
    return this.http.get<WorldObject[]>(
      `api/v1/world-object/search?prompt=${prompt}&amount=10`
    );
  }
}
