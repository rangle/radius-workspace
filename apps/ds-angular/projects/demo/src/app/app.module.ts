import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { ListComponent } from './components/list/list.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { MoviesComponent } from './components/movies/movies.component';

import { DsModule } from '../../../ds/src/public-api';
import { EditorModule } from './editor/editor.module';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NavItemComponent,
    ListComponent,
    ListItemComponent,
    MoviesComponent
  ],
  imports: [
    BrowserModule,
    DsModule,
    EditorModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
