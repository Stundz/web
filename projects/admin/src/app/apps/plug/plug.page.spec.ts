import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PlugPage } from './plug.page';

describe('PlugPage', () => {
  let fixture: ComponentFixture<PlugPage>;
  let http: HttpTestingController;
  const api = environment.url.api;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlugPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(PlugPage);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function flushCounts(papers = 4, tutors = 2, tutorials = 18): void {
    http
      .expectOne((req) => req.url === `${api}/plug/past-questions` && req.params.get('status') === 'PENDING')
      .flush(page(papers));
    http
      .expectOne((req) => req.url === `${api}/plug/tutors` && req.params.get('status') === 'pending')
      .flush(page(tutors));
    http
      .expectOne((req) => req.url === `${api}/plug/tutorials` && req.params.get('all') === '1')
      .flush(page(tutorials));
  }

  it('shows the three management tools and the queue counts', async () => {
    expect(fixture.nativeElement.textContent).toContain('Past questions');
    expect(fixture.nativeElement.textContent).toContain('Tutors');
    expect(fixture.nativeElement.textContent).toContain('Tutorials');
    flushCounts();
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('4');
    expect(text).toContain('2');
    expect(text).toContain('18');
    expect(text).toContain('Review papers');
    expect(text).toContain('Review applications');
    expect(text).toContain('Open tutorials');
  });

  it('keeps the tools available when a count cannot be loaded', async () => {
    http
      .expectOne((req) => req.url === `${api}/plug/past-questions`)
      .flush({}, { status: 500, statusText: 'Server error' });
    http.expectOne((req) => req.url === `${api}/plug/tutors`).flush(page(0));
    http.expectOne((req) => req.url === `${api}/plug/tutorials`).flush(page(1));
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Unavailable');
    expect(text).toContain('Review papers');
  });
});

function page(total: number) {
  return {
    data: [],
    links: {},
    meta: { total, from: 0, to: 0, current_page: 1, per_page: 1 },
  };
}
