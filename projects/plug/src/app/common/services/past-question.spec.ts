import { TestBed } from '@angular/core/testing';

import { PastQuestion } from './past-question';

describe('PastQuestion', () => {
  let service: PastQuestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PastQuestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
