import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  WorldObject,
  WorldObjectType,
  WorldObjectTypesEnhanced,
  WorldObjectService,
} from '../world-object.service';
import {
  lastValueFrom,
  map,
  ReplaySubject,
  startWith,
  Subject,
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

  readonly types = WorldObjectTypesEnhanced;

  readonly selectedType$ = new ReplaySubject<WorldObjectType>(1);
  readonly page$ = new Subject<PageEvent>();

  readonly currentData$ = this.selectedType$.pipe(
    switchMap((type) =>
      this.page$.pipe(
        startWith({ pageIndex: 0, pageSize: 10 }),
        map((page) => ({
          type,
          skip: page.pageIndex * page.pageSize,
          amount: page.pageSize,
        }))
      )
    ),
    switchMap(({ type, skip, amount }) =>
      this.woService.getPaged(type, skip, amount)
    )
  );

  readonly limit$ = this.currentData$.pipe(map((data) => data.limit));

  readonly worldObjects$ = new Subject<WorldObject[]>();

  constructor(private readonly woService: WorldObjectService) {}

  ngOnInit() {
    this.currentData$.subscribe((data) => console.log(data));
  }

  async doSearch() {
    console.log(this.search.value);
    var result = await lastValueFrom(
      this.woService.search(this.search.value ?? '')
    );
  }

  pageChanged(event: PageEvent) {
    console.log(event);
  }
}
