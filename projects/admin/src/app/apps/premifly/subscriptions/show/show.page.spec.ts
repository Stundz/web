import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPage } from './show.page';

describe('ShowPage', () => {
  let component: ShowPage;
  let fixture: ComponentFixture<ShowPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
