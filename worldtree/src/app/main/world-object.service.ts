import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, of, ReplaySubject } from 'rxjs';

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
  type: WorldObjectType;
  name: string;
  description: string;
  attributes: { [key: string]: string };
  sourceIds: number[];
}

type Paged<T> = { limit: number; data: T[] };

@Injectable({
  providedIn: 'root',
})
export class WorldObjectService {
  items: WorldObject[] = [];
  items$ = new ReplaySubject<WorldObject[]>(1);

  constructor(private readonly http: HttpClient) {
    [4, 5, 7, 8, 9].forEach(async (id) => {
      const item = await lastValueFrom(this.get(id));
      this.items.push(item);
      this.items$.next(this.items);
    });
  }

  get(id: number) {
    return this.http.get<WorldObject>(`assets/objects/${id}.json`);
  }

  amount(params: {
    type?: WorldObjectType;
    amount: number;
    skip: number;
    query?: string;
  }) {
    return this.getPaged(params).pipe(map((x) => x.length));
  }

  getPaged(params: {
    type?: WorldObjectType;
    amount: number;
    skip: number;
    query?: string;
    sourceId?: number;
  }) {
    return this.items$.pipe(
      map((items) =>
        items
          .filter((x) => params.type == null || x.type === params.type)
          .filter(
            (x) =>
              params.query == null ||
              x.name.toLowerCase().includes(params.query.toLowerCase())
          )
          .filter(
            (x) =>
              params.sourceId == null || x.sourceIds.includes(params.sourceId)
          )
          .slice(params.skip, params.skip + params.amount)
      )
    );
  }

  search(prompt: string, amount: number) {
    return lastValueFrom(
      this.http.get<WorldObject[]>(`api/v1/world-objects/search`, {
        params: { prompt, amount },
      })
    );
  }

  generate(sourceText: string, existingItems: WorldObject[]) {
    const source = sourceText;
    const wo_ids = existingItems.map((x) => x.id);
    return lastValueFrom(
      this.http.post<WorldObject[]>(`api/v1/world-objects/generate`, {
        source,
        wo_ids,
      })
    );
  }

  persist(item: WorldObject, sourceId: number) {
    return lastValueFrom(
      this.http.post<number>(`api/v1/world-object/persist`, { item, sourceId })
    );
  }
}
