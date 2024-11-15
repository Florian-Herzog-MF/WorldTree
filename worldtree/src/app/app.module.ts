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

@NgModule({
  declarations: [
    AppComponent,
    VerticalPageComponent,
    DashboardComponent,
    SpinnerComponent,
    CardPlaceholderComponent,
    SectionComponent,
    BackdropDirective,
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
