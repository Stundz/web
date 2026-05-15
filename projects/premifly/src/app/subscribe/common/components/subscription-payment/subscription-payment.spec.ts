import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPayment } from './subscription-payment';

describe('SubscriptionPayment', () => {
  let component: SubscriptionPayment;
  let fixture: ComponentFixture<SubscriptionPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
