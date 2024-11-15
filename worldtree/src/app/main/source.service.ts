import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Source {
  id: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  constructor(private readonly http: HttpClient) {}

  public get(id: string) {
    return this.http.get<Source>(`api/v1/source/${id}`);
  }
}
