import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesComponent } from './pages/notes/notes.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NoteDetailsComponent } from './pages/note-details/note-details.component';
import { TagsComponent } from './pages/tags/tags.component';
import { RemindersComponent } from './pages/reminders/reminders.component';
import { TagDetailsComponent } from './pages/tag-details/tag-details.component';
import { ReminderDetailsComponent } from './pages/reminder-details/reminder-details.component';

const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: [
    { path: ':notes/list', component: NotesComponent },
    { path: ':notes/list/new', component: NoteDetailsComponent },
    { path: ':notes/list/id/:id', component: NoteDetailsComponent },
    { path: ':notes/tags', component: TagsComponent },
    { path: ':notes/tags/new', component: TagDetailsComponent },
    { path: ':notes/tags/id/:id', component: TagDetailsComponent },
    { path: ':notes/reminders', component: RemindersComponent },
    { path: ':notes/reminders/new', component: ReminderDetailsComponent },
    { path: ':notes/reminders/id/:id', component: ReminderDetailsComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
