import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { UploadPage } from './upload.page';

describe('Upload past question', () => {
  let fixture: ComponentFixture<UploadPage>;
  let http: HttpTestingController;
  const api = environment.url.api;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPage],
      providers: [
        provideRouter([{ path: 'app/plug/past-questions', component: UploadPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UploadPage);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${api}/plug/institutions`).flush([
      { id: 'inst', name: 'University of Buea', slug: 'ub', acronym: 'UB' },
    ]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('posts the course, year, and PDF', async () => {
    const form = fixture.componentInstance.form;
    form.controls.institution_id.setValue('inst');
    await Promise.resolve();
    TestBed.flushEffects();
    http.expectOne(`${api}/plug/institution/inst/faculties`).flush([{ id: 'fac', name: 'Engineering' }]);
    await fixture.whenStable();
    form.controls.faculty_id.setValue('fac');
    await Promise.resolve();
    TestBed.flushEffects();
    http.expectOne(`${api}/plug/faculty/fac/departments`).flush([{ id: 'dep', name: 'Computer Engineering' }]);
    await fixture.whenStable();
    form.controls.department_id.setValue('dep');
    await Promise.resolve();
    TestBed.flushEffects();
    http.expectOne(`${api}/plug/department/dep/courses`).flush([
      { id: 'course-1', code: 'CEF401', title: 'Compiler Construction' },
    ]);
    await fixture.whenStable();
    form.controls.course_id.setValue('course-1');
    form.controls.year.setValue(2024);
    form.controls.file.setValue(new File(['%PDF'], 'cef401.pdf', { type: 'application/pdf' }));

    fixture.nativeElement.querySelector('form').requestSubmit();
    const request = http.expectOne(`${api}/plug/past-question`);
    expect(request.request.method).toBe('POST');
    const body = request.request.body as FormData;
    expect(body.get('course_id')).toBe('course-1');
    expect(body.get('year')).toBe('2024');
    expect(body.get('file')).toBeInstanceOf(File);
    request.flush('', { status: 201, statusText: 'Created' });
    await fixture.whenStable();
  });

  it('shows the server message when the upload is rejected', async () => {
    const form = fixture.componentInstance.form;
    form.controls.institution_id.setValue('inst', { emitEvent: false });
    form.controls.faculty_id.setValue('fac', { emitEvent: false });
    form.controls.department_id.setValue('dep', { emitEvent: false });
    form.controls.course_id.setValue('course-1', { emitEvent: false });
    form.controls.file.setValue(new File(['%PDF'], 'cef401.pdf', { type: 'application/pdf' }));
    fixture.nativeElement.querySelector('form').requestSubmit();
    http
      .expectOne(`${api}/plug/past-question`)
      .flush(
        { message: 'The given data was invalid.', errors: { file: ['A PDF is required.'] } },
        { status: 422, statusText: 'Unprocessable' },
      );
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('A PDF is required.');
  });
});
