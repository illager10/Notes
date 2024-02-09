import { Component, Input, Output, OnInit, EventEmitter, ElementRef, Renderer2, ViewChild  } from '@angular/core';
import { Tag } from '../models/tag.model';
import { NotesService } from '../services/notes.service';
import { TagsService } from '../services/tags.service';

@Component({
  selector: 'app-reminder-card',
  templateUrl: './reminder-card.component.html',
  styleUrls: ['./reminder-card.component.scss']
})
export class ReminderCardComponent implements OnInit{
  @Input('title') title: string;
  @Input('body') body: string;
  @Input('reminderId') reminderId: string;
  @Input('date') date: string;

  @Output('delete') deleteEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('findTag') findTagEvent: EventEmitter<string> = new EventEmitter<string>();

  selectedTags: Tag[] = [];

  @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  @ViewChild('noteP') noteP: ElementRef<HTMLElement>;

  constructor(private notesService: NotesService,
    private tagsService: TagsService,
    private renderer: Renderer2){}

  ngAfterViewInit() {

    let style = window.getComputedStyle(this.bodyText.nativeElement);

    if (this.noteP.nativeElement.scrollHeight > this.bodyText.nativeElement.clientHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    }
    else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }



  ngOnInit(): void {
    this.notesService.getNote(this.reminderId)
    .subscribe({
      next: (note) =>{
        note.notesTags.forEach(noteTag => {
          this.tagsService.getTag(noteTag.tagId)
          .subscribe({
            next: (tag) =>{
              this.selectedTags.push(tag);
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


  deleteReminder(id: string){
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

}
