import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastQuestionsPage } from './past-questions.page';

describe('PastQuestionsPage', () => {
  let component: PastQuestionsPage;
  let fixture: ComponentFixture<PastQuestionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastQuestionsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
