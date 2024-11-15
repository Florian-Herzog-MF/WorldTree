import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { SearchCharactersComponent } from './characters/search-characters/search-characters.component';
import { NewSourceComponent } from './sources/new-source/new-source.component';

const routes: Routes = [
  {
    path: 'new-source',
    component: NewSourceComponent,
  },
  {
    path: 'characters',
    component: SearchCharactersComponent,
  },
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
