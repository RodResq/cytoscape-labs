import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsCancelPreviousComponent } from './buttons-cancel-previous.component';

describe('ButtonsCancelPreviousComponent', () => {
  let component: ButtonsCancelPreviousComponent;
  let fixture: ComponentFixture<ButtonsCancelPreviousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsCancelPreviousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonsCancelPreviousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
