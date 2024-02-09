import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersComponent } from './reminders.component';

describe('RemindersComponent', () => {
  let component: RemindersComponent;
  let fixture: ComponentFixture<RemindersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemindersComponent]
    });
    fixture = TestBed.createComponent(RemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
