import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Wo {
  id: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

@Injectable({
  providedIn: 'root',
})
export class WoService {
  constructor(private readonly http: HttpClient) {}

  debug() {
    return this.http.get<string>('api', {});
  }

  search(prompt: string) {
    return this.http.get<Wo[]>(`api/v1/wo/search?prompt=${prompt}&amount=10`, {
      headers: defaultHeaders,
    });
  }
}
