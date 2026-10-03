import { TestBed } from '@angular/core/testing';

import { PremiflyService } from './service';

describe('PremiflyService', () => {
  let service: PremiflyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiflyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
