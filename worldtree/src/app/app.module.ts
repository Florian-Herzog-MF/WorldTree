import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { VerticalPageComponent } from './common/vertical-page/vertical-page.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialImports } from './main/imports/material-imports';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { CardPlaceholderComponent } from './common/card-placeholder/card-placeholder.component';
import { SectionComponent } from './common/section/section.component';
import { BackdropDirective } from './common/backdrop.directive';
import { NewSourceComponent } from './sources/new-source/new-source.component';
import { WorldObjectListComponent } from './main/world-object-list/world-object-list.component';
import { WorldObjectDetailsDialogComponent } from './main/world-object-details-dialog/world-object-details-dialog.component';
import { GenerateSourceComponent } from './sources/generate-source/generate-source.component';
import { WriteSourceComponent } from './sources/write-source/write-source.component';
import { ValidateSourceDialogComponent } from './sources/validate-source-dialog/validate-source-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    VerticalPageComponent,
    DashboardComponent,
    SpinnerComponent,
    CardPlaceholderComponent,
    SectionComponent,
    BackdropDirective,
    NewSourceComponent,
    WorldObjectListComponent,
    WorldObjectDetailsDialogComponent,
    GenerateSourceComponent,
    WriteSourceComponent,
    ValidateSourceDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ...MaterialImports,
  ],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
