import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorldObjectType, WorldObjectService } from '../world-object.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  lastValueFrom,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SourceService } from 'src/app/sources/source.service';

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
    { value: 'source', label: 'Sources' },
  ];

  type = new FormControl<WorldObjectType | 'source' | null>(null);
  type$ = this.type.valueChanges.pipe(
    startWith(this.type.value),
    map((x) => x ?? undefined)
  );

  pageSize$ = new BehaviorSubject<number>(10);
  pageIndex$ = new BehaviorSubject<number>(0);

  readonly fetchParams$ = new BehaviorSubject<{
    skip: number;
    amount: number;
  }>({ skip: 0, amount: 10 });

  params$ = combineLatest([
    this.type$,
    this.query$,
    this.pageSize$,
    this.pageIndex$,
  ]).pipe(
    map(([type, query, pageSize, pageIndex]) => ({
      type,
      amount: pageSize,
      skip: pageIndex * pageSize,
      query,
    }))
  );

  worldObjects$ = this.params$.pipe(
    debounceTime(300),
    filter((params) => params.type !== ('source' as any)),
    map((params) => ({ ...params, type: params.type as WorldObjectType })),
    switchMap((params) => this.worldObjectService.getPaged(params)),
    shareReplay(1)
  );

  sources$ = this.params$.pipe(
    filter((params) => params.type === ('source' as any)),
    switchMap((params) => this.sourceService.search(params)),
    shareReplay(1)
  );

  hideWorldObjects$ = this.params$.pipe(
    map((params) => params.type === ('source' as any))
  );

  hideSources$ = this.params$.pipe(
    map((params) => params.type !== ('source' as any))
  );

  limit$ = this.params$.pipe(
    filter((params) => params.type !== ('source' as any)),
    map((params) => ({ ...params, type: params.type as WorldObjectType })),
    switchMap((params) => this.worldObjectService.amount(params))
  );

  constructor(
    private readonly worldObjectService: WorldObjectService,
    private readonly sourceService: SourceService
  ) {}

  ngOnInit() {}

  async doSearch() {
    var result = await lastValueFrom(
      this.worldObjectService.search(this.search.value ?? '')
    );
  }

  pageChanged(event: PageEvent) {
    this.fetchParams$.next({
      ...this.fetchParams$.value,
      skip: event.pageIndex * event.pageSize,
      amount: event.pageSize,
    });
  }

  itemsForSource(sourceId: number) {
    return this.worldObjectService.getPaged({ sourceId, amount: 100, skip: 0 });
  }
}
