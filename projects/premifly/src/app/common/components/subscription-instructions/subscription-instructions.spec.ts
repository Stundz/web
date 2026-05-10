import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionInstructions } from './subscription-instructions';

describe('SubscriptionInstructions', () => {
  let component: SubscriptionInstructions;
  let fixture: ComponentFixture<SubscriptionInstructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionInstructions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionInstructions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
