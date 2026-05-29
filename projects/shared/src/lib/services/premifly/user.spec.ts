import { TestBed } from '@angular/core/testing';

import { PremiflyUser } from './user';

describe('PremiflyUser', () => {
  let service: PremiflyUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiflyUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
