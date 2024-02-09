import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  ApiUrl: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  getAllTags(): Observable<Tag[]>{
    return this.http.get<Tag[]>(this.ApiUrl + '/api/Tags');
  }

  getTagOnText(Text: string): Observable<Tag[]>{
    return this.http.get<Tag[]>(this.ApiUrl + '/api/Tags/' + Text);
  }

  addTag(addTagRequest: Tag): Observable<Tag>{
    addTagRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Tag>(this.ApiUrl + '/api/Tags', addTagRequest);
  }

  getTag(id: string): Observable<Tag>{
    return this.http.get<Tag>(this.ApiUrl + '/api/Tags/' + id);
  }

  updateTag(id: string, updateTagRequest: Tag): Observable<Tag>{
    return this.http.put<Tag>(this.ApiUrl + '/api/Tags/' + id, updateTagRequest);
  }

  deleteTag(id: string): Observable<Tag>{
    return this.http.delete<Tag>(this.ApiUrl + '/api/Tags/' + id);
  }
}
