import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/models/note.model';
import { NoteTag } from 'src/app/models/notetag.model';
import { Tag } from 'src/app/models/tag.model';
import { NotesService } from 'src/app/services/notes.service';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit{

  noteDetails: Note = {
    id: '00000000-0000-0000-0000-000000000000',
    title: '',
    description: '',
    date: new Date(0, 0, 0, 0, 0),
    notesTags: []
  }

  tags: Tag[] = [];
  typePage: boolean = false;

  constructor(private noteService: NotesService,
              private tagService: TagsService ,
              private router: Router,
              private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) =>{
        const id = params.get('id');

        if(id){
          this.noteService.getNote(id)
          .subscribe({
            next:(response) =>{
              this.noteDetails = response;

            }
          });
          this.typePage = true;
        }
      }
    })


    this.getAllTags();
  }


  getAllTags(): void
  {
    this.tagService.getAllTags()
    .subscribe({
      next: (tags) =>{
        this.tags = tags;
      },
      error: (response)=>{
        console.log(response);
      }
    });

  }


  onSubmit() {
    this.noteDetails.notesTags = [];
    this.noteDetails.title = this.noteDetails.title.trim();
    this.tags.forEach(tag =>{
      var element = <HTMLInputElement> document.getElementById(tag.id);
      if(element.checked)
      {
        var noteTag: NoteTag ={
          noteId: this.noteDetails.id,
          tagId: tag.id
        }
        this.noteDetails.notesTags.push(noteTag);
      }
    });
    
    if(this.typePage)
      this.updateNote();
    else
      this.addNote();
  }


  isChecked(tag: Tag): boolean
  {
    let isChecked: boolean = false;

    this.noteDetails.notesTags.forEach(noteTag =>{
      if(noteTag.tagId == tag.id)
      {
        isChecked = true;
      }
      
    }); 

    return isChecked;
  }

  Cancel() {
    this.router.navigateByUrl('notes/list');
  }


  updateNote(){
    this.noteService.updateNote(this.noteDetails.id, this.noteDetails)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('notes/list');
      }
    })
  }


  addNote(){
    console.log(this.noteDetails);
    this.noteService.addNote(this.noteDetails)
    .subscribe({
      next: (note)=>{
        console.log(note);
        this.router.navigateByUrl('notes/list');
      }
    });
  }
}