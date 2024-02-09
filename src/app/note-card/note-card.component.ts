import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { TagsService } from 'src/app/services/tags.service';
import { Tag } from '../models/tag.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit{

  @Input('title') title: string;
  @Input('body') body: string;
  @Input('noteId') noteId: string;

  @Output('deleteNoteId') deleteEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('findTag') findTagEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('remindNote') remindNoteEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  @ViewChild('noteP') noteP: ElementRef<HTMLElement>;
  @ViewChild('tagsList') tagsList: ElementRef<HTMLElement>;
  @ViewChild('tagsText') tagsText: ElementRef<HTMLElement>;

  selectedTags: Tag[] = [];

  constructor(private renderer: Renderer2,
              private notesService: NotesService,
              private tagsService: TagsService,
              private router: Router) {}


  ngAfterViewInit() {

    let style = window.getComputedStyle(this.bodyText.nativeElement);

    if (this.noteP.nativeElement.scrollHeight > this.bodyText.nativeElement.clientHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    }
    else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  ngOnInit() {
    this.notesService.getNote(this.noteId)
    .subscribe({
      next: (note) =>{
        note.notesTags.forEach(noteTag => {
          this.tagsService.getTag(noteTag.tagId)
          .subscribe({
            next: (tag) =>{
              this.selectedTags.push(tag);

              this.selectedTags.sort((a, b) => {
                if (a.title < b.title) {
                  return -1;
                } else if (a.title > b.title) {
                  return 1;
                } else {
                  return 0;
                }
              });
            },
            error: (response)=>{
              console.log(response);
            }
          });
        });
      },
      error: (response)=>{
        console.log(response);
      }
    });
  }

  deleteNote(id: string){
    this.notesService.deleteNote(id)
    .subscribe({
      next: (response) =>{
        this.deleteEvent.emit(id);
      }
    })
  }

  findTag(title: string){
    this.findTagEvent.emit(title);
  }

  remindNote(id: string){
    this.remindNoteEvent.emit(id);
  }
}