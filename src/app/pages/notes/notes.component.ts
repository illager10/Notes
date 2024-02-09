import { Component, OnInit, Query } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from 'src/app/models/note.model';
import { Tag } from 'src/app/models/tag.model';
import { NotesService } from 'src/app/services/notes.service';
import { TagsService } from 'src/app/services/tags.service';
import { trigger, transition, style, animate, query, stagger} from '@angular/animations';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: [
    trigger('itemAnim', [
      transition('void => *', [
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
        }), 
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*'
        })),
        animate(200)
      ]),

      transition('* => void', [
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0
        })),
        animate('150ms ease-out', style({
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0, 
          paddingLeft: 0,
          'margin-bottom': '0'
        }))
      ])
    ]), 

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})

export class NotesComponent implements OnInit{

  notes: Note[] = [];
  tags: Tag[] = [];
  filteredNotes: Note[] = [];

  remNote: Note;

  isLoading: boolean = false;
  isRemind: boolean = false;
  isDate : boolean = false;

  constructor(private notesService: NotesService,
              private tagsService: TagsService,
              private router: Router) {}

  ngOnInit() {
    this.isLoading = true;

    this.notesService.getAllNotes()
    .subscribe({
      next: (notes) =>{
        console.log(notes);
        this.notes = notes;
        this.filteredNotes = this.notes;
        this.isLoading = false;
      },
      error: (response)=>{
        console.log(response);
      }
    });

    this.tagsService.getAllTags()
    .subscribe({
      next: (tag) =>{
        console.log(tag);
        this.tags = tag;
      },
      error: (response)=>{
        console.log(response);
      }
    });
  }

  Add() {
      this.router.navigateByUrl('notes/list/new');
  }

  filter(query: string){
    if(query == "" || this.notes == null){
      this.filteredNotes = this.notes;
      return;
    }

    this.isLoading = true;
    const chbxTitle = document.getElementById("findTitle") as HTMLInputElement;
    const chbxDesc = document.getElementById("findDesc") as HTMLInputElement;
    const chbxTags = document.getElementById("findTags") as HTMLInputElement;


    let allResults: Note[] = new Array<Note>();
    query = query.toLowerCase().trim();

    let terms: string[] = query.split(' ');
    terms = this.removeDuplications(terms);
    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term, chbxTitle.checked, chbxDesc.checked, chbxTags.checked);
      allResults = [...allResults, ...results]
    });

    this.isLoading = false;
    this.filteredNotes = this.removeDuplications(allResults);
  }

  removeDuplications(arr: Array<any>): Array<any>{
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string, findTitle: boolean, findDesc:boolean, findTags: boolean): Array<Note>{
    if(!findTitle && !findDesc && !findTags){
      findTitle = true;
      findDesc = true;
      findTags = true;
    }
    query = query.toLowerCase().trim();

    let relevantNotes = this.notes.filter(note =>{
      if((findDesc && note.description && note.description.toLowerCase().includes(query)) || (findTitle && note.title.toLowerCase().includes(query))){
        return true;
      }

      let isTagFind: boolean = false;
      if(findTags){
        note.notesTags.forEach(noteTag => {
          if(this.tags.find(tag => tag.id === noteTag.tagId)?.title.toLowerCase().includes(query)){
            isTagFind = true;
            return;
          }
        });
      }

      return isTagFind;
    });

    return relevantNotes;
  }

  deleteNote(id: string){
    let indexNote = this.notes.findIndex(item => item.id === id);;
    if(indexNote != -1){
      this.notes.splice(indexNote, 1);
    }

    let indexFilterNote = this.filteredNotes.findIndex(item => item.id === id);;
    if(indexFilterNote != -1){
      this.filteredNotes.splice(indexFilterNote, 1);
    }
  }
  
  findTag(title: string, input: HTMLInputElement){
    if (input.value !== '') {
      input.value += ' ';
    }
    input.value += title;
    
    this.filter(input.value);
  }
  
  openRemindNote(id: string){
    this.notesService.getNote(id)
    .subscribe({
      next: (note) =>{
        this.isRemind = true;
        const mainContainer = document.querySelector('.main-container') as HTMLDivElement;
        if(mainContainer){
          mainContainer.classList.toggle('blurred');
          mainContainer.style.pointerEvents = 'none';
          this.isRemind = true;
        }
        this.remNote = note;
        
        console.log(note);
      },
      error: (response)=>{
        console.log(response);
      }
    });
  }
  
  cancel(){
    const mainContainer = document.querySelector('.main-container') as HTMLDivElement;
    if(mainContainer){
      mainContainer.classList.toggle('blurred');
      mainContainer.style.pointerEvents = 'auto';
      this.isRemind = false;
    }
  }
  
  save(){
    var calendar = <HTMLInputElement> document.getElementById('calendar');
    this.remNote.date = new Date(calendar.value);

    this.notesService.updateNote(this.remNote.id, this.remNote)
    .subscribe({
      next: (response) => {
        const mainContainer = document.querySelector('.main-container') as HTMLDivElement;
        if(mainContainer){
          mainContainer.classList.toggle('blurred');
          mainContainer.style.pointerEvents = 'auto';
          this.isRemind = false;
        }
        
        this.deleteNote(this.remNote.id);
      }
    })
  }

  dateCheck()
  {
    var calendar = <HTMLInputElement> document.getElementById('calendar');
    this.isDate =  calendar.value != '';
  }
}