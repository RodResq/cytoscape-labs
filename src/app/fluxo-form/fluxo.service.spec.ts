import { TestBed } from '@angular/core/testing';

import { FluxoService } from './fluxo.service';

describe('FluxoService', () => {
  let service: FluxoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluxoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
