import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ShowPage } from './show.page';

describe('Tutor review', () => {
  let fixture: ComponentFixture<ShowPage>;
  let http: HttpTestingController;
  const url = `${environment.url.api}/plug/tutor/tutor-1`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowPage);
    fixture.componentRef.setInput('tutor', 'tutor-1');
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('rejects an application after a second click', async () => {
    http.expectOne(url).flush(tutor(null));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Pending');

    button('Reject').click();
    await fixture.whenStable();
    http.expectNone(url);
    button('Confirm rejection').click();
    const request = http.expectOne((req) => req.url === url && req.method === 'PATCH');
    expect(request.request.body).toEqual({ decision: 'reject' });
    request.flush(tutor('2020-01-01T00:00:00Z'));
    await Promise.resolve();
    TestBed.flushEffects();
    http.expectOne((req) => req.url === url && req.method === 'GET').flush(tutor('2020-01-01T00:00:00Z'));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Inactive');
  });

  function button(label: string): HTMLButtonElement {
    const match = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((item) => item.textContent?.includes(label));
    if (!match) throw new Error(`Missing button ${label}`);
    return match;
  }
});

function tutor(validUntil: string | null) {
  return {
    id: 'tutor-1',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    user_id: 'user-1',
    first_name: 'Amina',
    last_name: 'Ngo',
    phone: '670000000',
    endorsement: { name: 'Dr. Fon', email: 'fon@ubuea.cm' },
    valid_until: validUntil,
    courses: [{ id: 'course-1', code: 'CEF401', title: 'Compiler Construction' }],
  };
}
