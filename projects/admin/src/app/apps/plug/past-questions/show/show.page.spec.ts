import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ShowPage } from './show.page';

describe('Past question review', () => {
  let fixture: ComponentFixture<ShowPage>;
  let http: HttpTestingController;
  const url = `${environment.url.api}/plug/past-question/pq-1`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowPage);
    fixture.componentRef.setInput('past-question', 'pq-1');
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('asks for confirmation before approving a paper', async () => {
    http.expectOne(url).flush(paper('PENDING'));
    await fixture.whenStable();

    const approve = button('Approve');
    approve.click();
    await fixture.whenStable();
    http.expectNone(url);
    expect(fixture.nativeElement.textContent).toContain('Confirm approval');

    button('Confirm approval').click();
    const request = http.expectOne((req) => req.url === url && req.method === 'PATCH');
    expect(request.request.body).toEqual({ status: 'APPROVED' });
    request.flush(paper('APPROVED'));
    await Promise.resolve();
    TestBed.flushEffects();
    http.expectOne((req) => req.url === url && req.method === 'GET').flush(paper('APPROVED'));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Approved');
  });

  function button(label: string): HTMLButtonElement {
    const match = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((item) => item.textContent?.includes(label));
    if (!match) throw new Error(`Missing button ${label}`);
    return match;
  }
});

function paper(status: string) {
  return {
    id: 'pq-1',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    status,
    year: 2024,
    solutions_count: 0,
    course_id: 'course-1',
    publisher_id: null,
    course: { id: 'course-1', code: 'CEF401', title: 'Compiler Construction' },
  };
}
