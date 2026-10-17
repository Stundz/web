import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('filters activity by search text', async () => {
    const search = fixture.nativeElement.querySelector(
      'input[placeholder="Name, service, or status"]',
    ) as HTMLInputElement;
    search.value = 'Amara';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Amara Njoya');
  });

  it('shows an empty state when no activity matches', async () => {
    const search = fixture.nativeElement.querySelector(
      'input[placeholder="Name, service, or status"]',
    ) as HTMLInputElement;
    search.value = 'unmatched-record';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No activity matches your filters.');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
