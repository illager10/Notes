import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderCardComponent } from './reminder-card.component';

describe('ReminderCardComponent', () => {
  let component: ReminderCardComponent;
  let fixture: ComponentFixture<ReminderCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReminderCardComponent]
    });
    fixture = TestBed.createComponent(ReminderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
