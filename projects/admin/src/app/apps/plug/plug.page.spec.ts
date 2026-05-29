import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlugPage } from './plug.page';

describe('PlugPage', () => {
  let component: PlugPage;
  let fixture: ComponentFixture<PlugPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlugPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlugPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
