import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'worldtree';

  constructor(private matIconReg: MatIconRegistry) {}

  ngOnInit() {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
  }
}
