import { httpResource, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { Dropzone } from 'shared/directives';
import type { Plug } from 'shared/models';
import { toFormData } from 'shared/utils';
import { environment } from '../../../../../environments/environment';
import { errorText } from '../../http-error';

@Component({
  selector: 'admin-plug-upload-past-question',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    Dropzone,
  ],
  templateUrl: './upload.page.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../apps.page.css', '../../records.css', './upload.page.css'],
})
export class UploadPage {
  #http = inject(HttpClient);
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);
  #destroyRef = inject(DestroyRef);
  #formBuilder = inject(FormBuilder);
  readonly maxYear = new Date().getFullYear();
  readonly saving = signal(false);
  readonly failure = signal('');

  readonly form = this.#formBuilder.nonNullable.group({
    institution_id: ['', Validators.required],
    faculty_id: ['', Validators.required],
    department_id: ['', Validators.required],
    course_id: ['', Validators.required],
    year: [
      this.maxYear,
      [Validators.required, Validators.min(2000), Validators.max(this.maxYear)],
    ],
    file: this.#formBuilder.control<File | null>(null, Validators.required),
  });

  readonly institutionId = toSignal(
    this.form.controls.institution_id.valueChanges.pipe(
      startWith(this.form.controls.institution_id.value),
    ),
    { initialValue: '' },
  );
  readonly facultyId = toSignal(
    this.form.controls.faculty_id.valueChanges.pipe(startWith(this.form.controls.faculty_id.value)),
    { initialValue: '' },
  );
  readonly departmentId = toSignal(
    this.form.controls.department_id.valueChanges.pipe(
      startWith(this.form.controls.department_id.value),
    ),
    { initialValue: '' },
  );

  readonly institutions = httpResource<Plug.Institution[]>(
    () => `${environment.url.api}/plug/institutions`,
    { defaultValue: [] },
  );
  readonly faculties = httpResource<Plug.Faculty[]>(() => {
    const id = this.institutionId();
    return id ? `${environment.url.api}/plug/institution/${id}/faculties` : undefined;
  }, { defaultValue: [] });
  readonly departments = httpResource<Plug.Department[]>(() => {
    const id = this.facultyId();
    return id ? `${environment.url.api}/plug/faculty/${id}/departments` : undefined;
  }, { defaultValue: [] });
  readonly courses = httpResource<Plug.Course[]>(() => {
    const id = this.departmentId();
    return id ? `${environment.url.api}/plug/department/${id}/courses` : undefined;
  }, { defaultValue: [] });

  constructor() {
    this.form.controls.institution_id.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.form.patchValue({ faculty_id: '', department_id: '', course_id: '' });
    });
    this.form.controls.faculty_id.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.form.patchValue({ department_id: '', course_id: '' });
    });
    this.form.controls.department_id.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.form.patchValue({ course_id: '' });
    });
  }

  attach(files: File[]): void {
    const file = files[0] ?? null;
    this.form.controls.file.setValue(file);
    this.form.controls.file.markAsTouched();
  }

  clearFile(): void {
    this.form.controls.file.setValue(null);
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.failure.set('');
    this.#http
      .post(
        `${environment.url.api}/plug/past-question`,
        toFormData({ course_id: value.course_id, year: value.year, file: value.file }),
        { responseType: 'text' },
      )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.#snackBar.open('Past question uploaded and waiting for review.', 'Close', {
            duration: 4000,
          });
          void this.#router.navigate(['/app/plug/past-questions'], {
            queryParams: { status: 'PENDING' },
          });
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = errorText(error, 'The paper could not be uploaded.');
          this.failure.set(message);
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.#snackBar.open('Sign in before uploading a paper.', 'Close', { duration: 5000 });
          }
        },
      });
  }
}
