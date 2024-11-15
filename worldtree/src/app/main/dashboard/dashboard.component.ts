import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WoService } from '../wo.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  search = new FormControl('');

  constructor(private readonly woService: WoService) {}

  async doSearch() {
    console.log(this.search.value);
    var result = await lastValueFrom(
      this.woService.search(this.search.value ?? '')
    );
  }
}
