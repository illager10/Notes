import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotesComponent } from './pages/notes/notes.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NoteCardComponent } from './note-card/note-card.component';
import { NoteDetailsComponent } from './pages/note-details/note-details.component';
import { HttpClientModule } from '@angular/common/http';
import { TagCardComponent } from './tag-card/tag-card.component';
import { TagsComponent } from './pages/tags/tags.component';
import { TagDetailsComponent } from './pages/tag-details/tag-details.component';
import { ReminderCardComponent } from './reminder-card/reminder-card.component';
import { ReminderDetailsComponent } from './pages/reminder-details/reminder-details.component';
import { RemindersComponent } from './pages/reminders/reminders.component';


@NgModule({
  declarations: [
    AppComponent,
    NotesComponent,
    TagsComponent,
    TagCardComponent,
    MainLayoutComponent,
    NoteCardComponent,
    NoteDetailsComponent,
    TagDetailsComponent,
    RemindersComponent,
    ReminderCardComponent,
    ReminderDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
