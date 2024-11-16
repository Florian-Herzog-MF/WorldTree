import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, of, ReplaySubject, tap } from 'rxjs';

export interface Source {
  id: number;
  desc: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  sources: Source[] = [];
  sources$ = new ReplaySubject<Source[]>(1);

  constructor(private readonly http: HttpClient) {
    [1, 2, 3].forEach(async (id) => {
      const source = await lastValueFrom(this.get(id));
      this.sources.push(source);
      this.sources$.next(this.sources);
    });
  }

  public get(id: number) {
    return this.http.get<Source>(`assets/sources/${id}.json`);
  }

  public search(params: { query: string; amount: number }) {
    return this.sources$.pipe(
      map((sources) =>
        sources.filter((x) =>
          x.text.toLocaleLowerCase().includes(params.query.toLocaleLowerCase())
        )
      )
    );
  }

  public generate(prompt: string, amount: number) {
    return lastValueFrom(
      this.http.post<string>('api/v1/source/generate', { prompt, amount })
    );
  }

  public persist(text: string, summary: string) {
    return lastValueFrom(
      this.http.post<number>(
        'api/v1/source/persist',
        { text },
        {
          params: { summary },
        }
      )
    );
  }
}
