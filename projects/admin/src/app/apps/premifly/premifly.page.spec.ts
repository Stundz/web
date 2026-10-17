import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PremiflyPage } from './premifly.page';

describe('PremiflyPage', () => {
  let fixture: ComponentFixture<PremiflyPage>;
  let http: HttpTestingController;
  const url = `${environment.url.api}/premifly/stats`;
  const stats = {
    users: { total: 240, this_week: 20, last_week: 10 },
    accounts: { total: 12, this_week: 0, last_week: 0 },
    services: { total: 6, this_week: 2, last_week: 4 },
    subscriptions: { total: 100, this_week: 10, last_week: 10 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiflyPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(PremiflyPage);
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('shows loading, then API totals and accurate weekly comparisons', async () => {
    expect(fixture.nativeElement.textContent).toContain('Loading workspace statistics');
    http.expectOne(url).flush(stats);
    await fixture.whenStable();
    const cards = fixture.nativeElement.querySelectorAll('.metric-link');
    expect(cards.length).toBe(4);
    expect(cards[0].textContent).toContain('240');
    expect(cards[0].textContent).toContain('+100%');
    expect(cards[1].textContent).toContain('No prior-week baseline');
    expect(cards[2].textContent).toContain('-50%');
    expect(cards[3].textContent).toContain('0%');
  });

  it('keeps workspace tools available after a failed request and allows retry', async () => {
    http.expectOne(url).flush({}, { status: 500, statusText: 'Server error' });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Statistics are unavailable');
    expect(fixture.nativeElement.querySelectorAll('.management a').length).toBe(4);
    const retry = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(button => button.textContent?.includes('Try again'))!;
    retry.click();
    await fixture.whenStable();
    http.expectOne(url).flush(stats);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.metric-link').length).toBe(4);
  });
});
