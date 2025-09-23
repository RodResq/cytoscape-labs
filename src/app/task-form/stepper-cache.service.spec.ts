import { TestBed } from '@angular/core/testing';

import { StepperCacheService } from './stepper-cache.service';

describe('StepperCacheService', () => {
  let service: StepperCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepperCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
