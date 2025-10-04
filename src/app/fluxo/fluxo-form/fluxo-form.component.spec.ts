import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoFormComponent } from './fluxo-form.component';

describe('FluxoFormComponent', () => {
  let component: FluxoFormComponent;
  let fixture: ComponentFixture<FluxoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
