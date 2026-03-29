import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialCard } from './tutorial-card';

describe('TutorialCard', () => {
  let component: TutorialCard;
  let fixture: ComponentFixture<TutorialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
