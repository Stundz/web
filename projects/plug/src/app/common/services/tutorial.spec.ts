import { TestBed } from '@angular/core/testing';

import { Tutorials } from './tutorials';

describe('Tutorials', () => {
  let service: Tutorials;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tutorials);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
