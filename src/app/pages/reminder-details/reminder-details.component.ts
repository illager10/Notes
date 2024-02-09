import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { TagsService } from 'src/app/services/tags.service';
import { Tag } from 'src/app/models/tag.model';
import { NoteTag } from 'src/app/models/notetag.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reminder-details',
  templateUrl: './reminder-details.component.html',
  styleUrls: ['./reminder-details.component.scss']
})
export class ReminderDetailsComponent implements OnInit{
  
  reminderDetails: Note = {
    id: '00000000-0000-0000-0000-000000000000',
    title: '',
    description: '',
    date: new Date(0, 0, 0, 0, 0),
    notesTags: []
  }

  isDate : boolean = false;

  constructor(private notesService: NotesService,
              private tagsService: TagsService,
              private route: ActivatedRoute,
              private router: Router){}

  tags: Tag[] = [];
  typePage: boolean = false;
  str: string = "";

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) =>{
        const id = params.get('id');

        if(id){
          this.notesService.getNote(id)
          .subscribe({
            next:(response) =>{
              this.reminderDetails = response;
              this.isDate = true;
              
              this.str = new Date(this.reminderDetails.date).toISOString().slice(0,-8);
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
    this.tagsService.getAllTags()
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
    this.reminderDetails.notesTags = [];
    var calendar = <HTMLInputElement> document.getElementById('calendar');
    this.reminderDetails.date = new Date(calendar.value);
    this.reminderDetails.title = this.reminderDetails.title.trim();

    this.tags.forEach(tag =>{
      var element = <HTMLInputElement> document.getElementById(tag.id);
      if(element.checked)
      {
        var noteTag: NoteTag ={
          noteId: this.reminderDetails.id,
          tagId: tag.id
        }
        this.reminderDetails.notesTags.push(noteTag);
      }
    });
    
    if(this.typePage)
      this.updateReminder();
    else
      this.addReminder();
  }


  isChecked(tag: Tag): boolean
  {
    let isChecked: boolean = false;

    this.reminderDetails.notesTags.forEach(noteTag =>{
      if(noteTag.tagId == tag.id)
      {
        isChecked = true;
      }      
    }); 

    return isChecked;
  }
  

  dateCheck()
  {
    var calendar = <HTMLInputElement> document.getElementById('calendar');
    this.isDate =  calendar.value != '';
  }


  Cancel() {
    this.router.navigateByUrl('notes/reminders');
  }


  updateReminder(){
    this.notesService.updateNote(this.reminderDetails.id, this.reminderDetails)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('notes/reminders');
      }
    })
  }


  addReminder(){
    console.log(this.reminderDetails);
    this.notesService.addNote(this.reminderDetails)
    .subscribe({
      next: (reminder)=>{
        console.log(reminder);
        this.router.navigateByUrl('notes/reminders');
      }
    });
  }
}
