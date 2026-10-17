import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IndexPage } from './index.page';

describe('Past question index', () => {
  let fixture: ComponentFixture<IndexPage>;
  let http: HttpTestingController;
  const url = `${environment.url.api}/plug/past-questions`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(IndexPage);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('lists papers and filters by status', async () => {
    http
      .expectOne((req) => req.url === url && req.params.get('status') === 'any')
      .flush(page([paper('pq-1', 'PENDING')]));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('CEF401');
    expect(fixture.nativeElement.textContent).toContain('Pending');

    const pending = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Pending');
    if (!pending) throw new Error('Pending filter was not rendered');
    const navigated = firstValueFrom(
      TestBed.inject(Router).events.pipe(filter((event) => event instanceof NavigationEnd)),
    );
    pending.click();
    await navigated;
    TestBed.flushEffects();
    const filtered = http.expectOne((req) => req.url === url && req.params.get('status') === 'PENDING');
    filtered.flush(page([]));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No papers in this view');
  });

  it('shows an error and retries the list', async () => {
    http
      .expectOne((req) => req.url === url && req.params.get('status') === 'any')
      .flush({}, { status: 500, statusText: 'Server error' });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Past questions are unavailable');
    const retry = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Try again'));
    retry?.click();
    await Promise.resolve();
    TestBed.flushEffects();
    http
      .expectOne((req) => req.url === url && req.params.get('status') === 'any')
      .flush(page([paper('pq-2', 'APPROVED')]));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Approved');
  });
});

function paper(id: string, status: string) {
  return {
    id,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    status,
    year: 2024,
    solutions_count: 1,
    course_id: 'course-1',
    publisher_id: null,
    course: {
      id: 'course-1',
      title: 'Compiler Construction',
      code: 'CEF401',
      created_at: '',
      updated_at: '',
      department: {
        id: 'dep',
        name: 'Computer Engineering',
        faculty_id: 'fac',
        created_at: '',
        updated_at: '',
        faculty: {
          id: 'fac',
          name: 'Engineering',
          institution_id: 'inst',
          created_at: '',
          updated_at: '',
          institution: { id: 'inst', name: 'University of Buea', slug: 'ub', acronym: 'UB', created_at: '', updated_at: '' },
        },
      },
    },
  };
}

function page(data: unknown[]) {
  return {
    data,
    links: {},
    meta: { total: data.length, from: data.length ? 1 : 0, to: data.length, current_page: 1, per_page: 12 },
  };
}
