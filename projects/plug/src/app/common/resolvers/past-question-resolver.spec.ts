import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { pastQuestionResolver } from './past-question-resolver';

describe('pastQuestionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => pastQuestionResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
