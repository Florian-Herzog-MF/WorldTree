import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorldObjectType, WorldObjectService } from '../world-object.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  lastValueFrom,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  search = new FormControl('');
  query$ = this.search.valueChanges.pipe(
    startWith(''),
    map((x) => x ?? '')
  );

  typeOptions = [
    { value: null, label: 'All' },
    { value: WorldObjectType.Character, label: 'Characters' },
    { value: WorldObjectType.Town, label: 'Towns' },
    { value: WorldObjectType.Building, label: 'Buildings' },
    { value: WorldObjectType.Item, label: 'Items' },
  ];

  type = new FormControl<WorldObjectType | null>(null);
  type$ = this.type.valueChanges.pipe(startWith(this.type.value));

  pageSize$ = new BehaviorSubject<number>(10);
  pageIndex$ = new BehaviorSubject<number>(0);

  readonly fetchParams$ = new BehaviorSubject<{
    skip: number;
    amount: number;
  }>({ skip: 0, amount: 10 });

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

  readonly limit$ = this.data$.pipe(map((data) => data.limit));

  readonly items$ = this.data$.pipe(map((data) => data.data));

  constructor(private readonly service: WorldObjectService) {}

  ngOnInit() {}

  async doSearch() {
    console.log(this.search.value);
    var result = await lastValueFrom(
      this.service.search(this.search.value ?? '')
    );
  }

  pageChanged(event: PageEvent) {
    this.fetchParams$.next({
      ...this.fetchParams$.value,
      skip: event.pageIndex * event.pageSize,
      amount: event.pageSize,
    });
  }
}
