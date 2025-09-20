import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNodeFormComponent } from './event-node-form.component';

describe('EventNodeFormComponent', () => {
  let component: EventNodeFormComponent;
  let fixture: ComponentFixture<EventNodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventNodeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventNodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
