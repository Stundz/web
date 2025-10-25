import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialSessions } from './tutorial-sessions';

describe('TutorialSessions', () => {
  let component: TutorialSessions;
  let fixture: ComponentFixture<TutorialSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialSessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialSessions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
