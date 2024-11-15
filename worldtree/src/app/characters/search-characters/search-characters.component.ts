import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  WorldObjectService,
  WorldObjectType,
} from 'src/app/main/world-object.service';

@Component({
  selector: 'app-search-characters',
  templateUrl: './search-characters.component.html',
  styleUrls: ['./search-characters.component.scss'],
})
export class SearchCharactersComponent implements OnInit {
  search = new FormControl('');

  query$ = this.search.valueChanges.pipe(
    startWith(''),
    map((x) => x?.trim() ?? '')
  );
  pageSize$ = new BehaviorSubject<number>(10);
  pageIndex$ = new BehaviorSubject<number>(0);

  data$ = combineLatest([this.query$, this.pageSize$, this.pageIndex$]).pipe(
    debounceTime(300),
    switchMap(([query, pageSize, pageIndex]) =>
      this.service.getPaged({
        type: WorldObjectType.Character,
        amount: pageSize,
        skip: pageIndex * pageSize,
        query,
      })
    ),
    shareReplay(1)
  );

  items$ = this.data$.pipe(map((x) => x.data));

  length$ = this.data$.pipe(map((x) => x.limit));

  constructor(private readonly service: WorldObjectService) {}

  ngOnInit() {
    this.query$.subscribe(() => this.pageIndex$.next(0));
  }
}
