import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tutorialResolver } from './tutorial-resolver';

describe('tutorialResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tutorialResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
