import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { NewSourceComponent } from './sources/new-source/new-source.component';
import { GenerateSourceComponent } from './sources/generate-source/generate-source.component';

const routes: Routes = [
  {
    path: 'create',
    component: NewSourceComponent,
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
