import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes.service';
import { Note } from 'src/app/models/note.model';
import { trigger, transition, style, animate, query, stagger} from '@angular/animations';
import { Tag } from 'src/app/models/tag.model';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
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
export class RemindersComponent implements OnInit{

  reminders : Note[] = [];
  tags: Tag[] = [];
  filteredReminders: Note[] = [];

  isLoading: boolean = false;

  constructor(private router: Router,
              private noteService: NotesService,
              private tagsService: TagsService) {}

  Add() {
    this.router.navigateByUrl('notes/reminders/new');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.noteService.getAllReminders()
    .subscribe({
      next: (reminders) =>{
        this.reminders = reminders;
        this.filteredReminders = reminders;
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

  deleteReminder(id: string){
    let indexNote = this.reminders.findIndex(item => item.id === id);;
    if(indexNote != -1){
      this.reminders.splice(indexNote, 1);
    }

    let indexFilterNote = this.filteredReminders.findIndex(item => item.id === id);;
    if(indexFilterNote != -1){
      this.filteredReminders.splice(indexFilterNote, 1);
    }
  }

  filter(query: string){
    if(query == "" || this.reminders == null){
      this.filteredReminders = this.reminders;
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
      let results: Note[] = this.relevantReminders(term, chbxTitle.checked, chbxDesc.checked, chbxTags.checked);
      allResults = [...allResults, ...results]
    });

    this.isLoading = false;
    this.filteredReminders = this.removeDuplications(allResults);
  }

  removeDuplications(arr: Array<any>): Array<any>{
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantReminders(query: string, findTitle: boolean, findDesc:boolean, findTags: boolean): Array<Note>{
    if(!findTitle && !findDesc && !findTags){
      findTitle = true;
      findDesc = true;
      findTags = true;
    }
    query = query.toLowerCase().trim();

    let relevantReminders = this.reminders.filter(remind =>{
      if((findDesc && remind.description && remind.description.toLowerCase().includes(query)) || (findTitle && remind.title.toLowerCase().includes(query))){
        return true;
      }

      let isTagFind: boolean = false;
      if(findTags){
        remind.notesTags.forEach(noteTag => {
          if(this.tags.find(tag => tag.id === noteTag.tagId)?.title.toLowerCase().includes(query)){
            isTagFind = true;
            return;
          }
        });
      }

      return isTagFind;
    });

    return relevantReminders;
  }

  findTag(title: string, input: HTMLInputElement){
    if (input.value !== '') {
      input.value += ' ';
    }
    input.value += title;
    
    this.filter(input.value);
  }
}
