import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLogo } from './service-logo';

describe('ServiceLogo', () => {
  let component: ServiceLogo;
  let fixture: ComponentFixture<ServiceLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
