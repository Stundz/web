import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiflyPage } from './premifly.page';

describe('PremiflyPage', () => {
  let component: PremiflyPage;
  let fixture: ComponentFixture<PremiflyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiflyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiflyPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
