import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tutorResolver } from './tutor-resolver';

describe('tutorResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tutorResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
