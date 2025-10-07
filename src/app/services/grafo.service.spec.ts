import { TestBed } from '@angular/core/testing';

import { GrafoService } from './grafo.service';

describe('GrafoService', () => {
  let service: GrafoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrafoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
