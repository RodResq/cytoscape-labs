import { TestBed } from '@angular/core/testing';

import { FormService } from '../../shared/services/form.service';

describe('FluxoService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
