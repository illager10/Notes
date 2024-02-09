import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderDetailsComponent } from './reminder-details.component';

describe('ReminderDetailsComponent', () => {
  let component: ReminderDetailsComponent;
  let fixture: ComponentFixture<ReminderDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReminderDetailsComponent]
    });
    fixture = TestBed.createComponent(ReminderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
