import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Note } from '../models/note.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotesService {

  ApiUrl: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  getAllNotes(): Observable<Note[]>{
    return this.http.get<Note[]>(this.ApiUrl + '/api/Notes');
  }

  getAllReminders(): Observable<Note[]>{
    return this.http.get<Note[]>(this.ApiUrl + '/api/Notes/Reminders');
  }

  getNoteOnText(Text: string): Observable<Note[]>{
    return this.http.get<Note[]>(this.ApiUrl + '/api/Notes/' + Text);
  }

  addNote(addNoteRequest: Note): Observable<Note>{
    addNoteRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Note>(this.ApiUrl + '/api/Notes', addNoteRequest);
  }

  getNote(id: string): Observable<Note>{
    return this.http.get<Note>(this.ApiUrl + '/api/Notes/' + id);
  }

  updateNote(id: string, updateNoteRequest: Note): Observable<Note>{
    return this.http.put<Note>(this.ApiUrl + '/api/Notes/' + id, updateNoteRequest);
  }

  deleteNote(id: string): Observable<Note>{
    return this.http.delete<Note>(this.ApiUrl + '/api/Notes/' + id);
  }
}