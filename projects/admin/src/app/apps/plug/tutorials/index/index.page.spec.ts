import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { IndexPage } from './index.page';

describe('Tutorial index', () => {
  let fixture: ComponentFixture<IndexPage>;
  let http: HttpTestingController;

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

  it('requests every academic year and shows the class', async () => {
    const request = http.expectOne(
      (req) => req.url === `${environment.url.api}/plug/tutorials` && req.params.get('all') === '1',
    );
    request.flush({
      data: [
        {
          id: 'class-1',
          created_at: '2026-10-01T00:00:00Z',
          updated_at: '2026-10-01T00:00:00Z',
          name: 'Saturday compilers',
          description: 'A weekly class.',
          price: 2500,
          course_id: 'course-1',
          tutor_id: 'tutor-1',
          course: { code: 'CEF401', title: 'Compiler Construction' },
          tutor: { first_name: 'Amina', last_name: 'Ngo' },
          session: null,
        },
      ],
      links: {},
      meta: { total: 1, from: 1, to: 1, current_page: 1, per_page: 15 },
    });
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Saturday compilers');
    expect(text).toContain('Amina Ngo');
    expect(text).toContain('XAF');
  });
});
