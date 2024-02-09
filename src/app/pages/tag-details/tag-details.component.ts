import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { Tag } from 'src/app/models/tag.model';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent implements OnInit{

  constructor(private router: Router,
              private activateRoute: ActivatedRoute,
              private tagService: TagsService) {}

  tagDetails: Tag = {
    id: '00000000-0000-0000-0000-000000000000',
    title: '',
    color: '',
    notesTags: []
  }

  typePage: boolean = false;
  
  Cancel() {
    this.router.navigateByUrl('notes/tags');
  }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe({
      next: (params) =>{
        const id = params.get('id');

        if(id){
          this.tagService.getTag(id)
          .subscribe({
            next:(response) =>{
              this.tagDetails = response;              
            }
          });
          this.typePage = true;
        }
      }
    });
  }

  onSubmit() {
    var color = <HTMLInputElement> document.getElementById('colorField');
    this.tagDetails.color = color.value;
    this.tagDetails.title = this.tagDetails.title.trim();
    if(this.typePage)
      this.updateTag();
    else
      this.addTag();
  }

  updateTag(){
    this.tagService.updateTag(this.tagDetails.id, this.tagDetails)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('notes/tags');
      }
    })
  }


  addTag(){
    this.tagService.addTag(this.tagDetails)
    .subscribe({
      next: (tag)=>{
        console.log(tag);
        this.router.navigateByUrl('notes/tags');
      }
    });
  }

}
